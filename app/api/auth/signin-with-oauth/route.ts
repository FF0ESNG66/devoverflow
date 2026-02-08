import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import z from "zod";
import slugify from "slugify";
import User from "@/database/user.model";
import Account from "@/database/account.model";

export async function POST(request: Request) {
    const { provider, providerAccountId, user } = await request.json();

    await dbConnect();

    // creating a new mongoose session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const validatedData = SignInWithOAuthSchema.safeParse({ provider, providerAccountId, user})

        if(!validatedData.success) {
            const flattered = z.flattenError(validatedData.error);
            throw new ValidationError(flattered.fieldErrors)
        }

        const { name, username, email, image } = user;

        const slugifyUsername = slugify(username, {
            lower: true,
            strict: true,
            trim: true,
        });

        // User creation process starts here

        let existingUser = await User.findOne({ slugifyUsername }).session(session);  //This last part is to cancel the whole transaction if this fails

        if(!existingUser) {
            // This is an array because we're passing an array to the create() method 
            // in order to be able of including the session as a second argument.
            // In this case mongoose will return an array, that's why we're wrapping the variable into an array
            [existingUser] = await User.create([{ name, username: slugifyUsername, email, image }],
                { session } // making this part of the mongoose transaction
            );

        } else {
            // if a user has already signed in using a different OAuth provider, 
            // then we'll upload its name and image with a new OAuth provider.
            const updatedData: { name?: string; image?: string } = {};

            if(existingUser.name !== name) updatedData.name = name;
            if(existingUser.image !== image) updatedData.image = image;
            
            if(Object.keys(updatedData).length > 0) {  // if there are changes in the initialized object
                await User.updateOne({ 
                    _id: existingUser._id }, // Field used to find the user
                    { $set: updatedData }  // Data used to update the user
                ).session(session) // making this part of the mongoose transaction
            }
        };

        // Account creation process starts here

        const existingAccount = await Account.findOne({ 
            userId: existingUser._id,
            provider,
            providerAccountId
        }).session(session);

        if(!existingAccount) {
            await Account.create([
                { userid: existingUser._id, name, image, provider, providerAccountId }
            ], { session })
        };

        await session.commitTransaction();

    } catch (error: unknown) {
        await session.abortTransaction(); //rolback all the changes if something fails
        return handleError(error, "api") as APIErrorResponse;

    } finally {
        session.endSession();
    }
}