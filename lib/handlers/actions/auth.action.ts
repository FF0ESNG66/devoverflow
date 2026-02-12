"use server";

import { ActionResponse, AuthCredentials, ErrorResponse } from "@/types/global";
import action from "../action";
import { SignUpSchema } from "@/lib/validations";
import handleError from "../error";
import  mongoose  from "mongoose";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import Account from "@/database/account.model";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";


export async function signupWithCredentials(params: AuthCredentials): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: SignUpSchema }); // validating with our server action validator 

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    };

    const { name, username, email, password } = validationResult.params!;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await dbConnect();

        const existingUser = await User.findOne({ email }).session(session);

        if (existingUser) {
            throw new Error("User already exists");

        };

        const existingUsername = await User.findOne({ username }).session(session);

        if(existingUsername) {
            throw new Error("Username already exists")
        };
        
        const hashedPassword = await bcrypt.hash(password, 12);


        const [newUser] = await User.create([{ username, name, email }], { session });

        await Account.create([{ user: newUser._id, name, provider: "credentials", providerAccountId: email, password: hashedPassword }], {session});

        await session.commitTransaction();

        await signIn("credentials", { email, password, redirect: false});

        return { success: true };

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        return handleError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
}