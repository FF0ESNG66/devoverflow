// Get /api/users/email

import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import { AccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import z from "zod";

// Post because we're getting the email from the body
export async function POST(request: Request) {
    const { providerAccountId } = await request.json();

    try {
        const validatedData = AccountSchema.partial().safeParse({ providerAccountId });

        if(!validatedData.success) {
            const flattened = z.flattenError(validatedData.error);
            throw new ValidationError(flattened.fieldErrors);
        };

        const account = await Account.findOne({ providerAccountId });

        if(!account) throw new NotFoundError("Account");

        return NextResponse.json({ success: true, data: account}, { status: 200 })
        
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}