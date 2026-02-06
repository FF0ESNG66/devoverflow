import User, { IUser } from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse, APIResponse } from "@/types/global";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


export async function GET() {
    try {
        await dbConnect();

        const users = await User.find();

        return NextResponse.json({ success: true, data: users }, { status: 200});

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}


// Create User
export async function POST(request: NextRequest): Promise<APIResponse<IUser>> {
    try {
        await dbConnect();

        const body = await request.json();

        // With this we validate if the data is in the correct format b4 sending it to our db
        const validatedData = UserSchema.safeParse(body);

        if(!validatedData.success) {
            const flattened = z.flattenError(validatedData.error);
            throw new ValidationError(flattened.fieldErrors);
        }

        // Destructuring to get the user and email and check if it already exists
        const { email, username } = validatedData.data;

        const existingUser = await User.findOne({ email });

        if(existingUser) throw new Error("User already exists");

        const existingUsername = await User.findOne({ username });

        if(existingUsername) throw new Error("User already exists");

        //All check passed, created user

        const newUser = await User.create(validatedData);

        return NextResponse.json({ success: true, data: newUser}, { status: 201 });

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}