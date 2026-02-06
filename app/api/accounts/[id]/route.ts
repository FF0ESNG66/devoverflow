import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import z from "zod";

// GET /api/accounts/[id]
export async function GET(_: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();

        const account = await Account.findById(id);

        if(!account) {
            throw new NotFoundError("Account");
        };

        return NextResponse.json({ success: true, data: Account }, { status: 200 })

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
};


// DELETE /api/users/[id]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();

        const account = await Account.findByIdAndDelete(id);

        if(!account) throw new NotFoundError("Account");

        // We're returning the data of the deleted user for scenarios where we want display "User SNG66 was deleted"
        return NextResponse.json({ success: true, data: account }, { status: 204 });

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }

    
}


// PUT /api/users/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();

        // Validating data first
        const body = await request.json();
        const validatedData = AccountSchema.partial().safeParse(body);

        if(!validatedData.success) {
            const flattened = z.flattenError(validatedData.error);
            throw new ValidationError(flattened.fieldErrors);
        }

        // By default, findOneAndUpdate() returns the document as it was before update was applied. 
        // If you set new: true, findOneAndUpdate() will instead give you the object after update was applied
        const updatedAccount  = await Account.findByIdAndUpdate(id, validatedData, { new: true });

        if(!updatedAccount ) throw new NotFoundError("Account");

        return NextResponse.json({ success: true, data: updatedAccount }, { status: 200})

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}