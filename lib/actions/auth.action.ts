"use server";

import { ActionResponse, AuthCredentials, ErrorResponse } from "@/types/global";
import action from "../action";
import { SignInSchema, SignUpSchema } from "@/lib/validations";
import handleError from "../error";
import  mongoose  from "mongoose";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import Account from "@/database/account.model";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { NotFoundError } from "@/lib/http-errors";


export async function signUpWithCredentials(params: AuthCredentials): Promise<ActionResponse> {
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
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;

    } finally {
        await session.endSession();
    }
}


export async function signInWithCredentials(
    params: Pick<AuthCredentials, "email" | "password"> // Creatse a new type that only includes email and password from AuthCredentials
): Promise<ActionResponse> {

    const validationResult = await action({ params, schema: SignInSchema }); // validating with our server action validator 

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    };

    const { email, password } = validationResult.params!;


    try {
        await dbConnect();

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new NotFoundError("User not found"); // returning same error

        };

        const existingAccount = await Account.findOne({ provider:"credentials", providerAccountId: email });

        if (!existingAccount) {
            throw new NotFoundError("User not found"); // returning same error

        };

        const passwordMatch = await bcrypt.compare(password, existingAccount.password);

        if(!passwordMatch) throw new NotFoundError("User not found"); // returning same error for security purposes


        await signIn("credentials", { email, password, redirect: false});

        return { success: true };

    } catch (error) {

        return handleError(error) as ErrorResponse;
    };
}