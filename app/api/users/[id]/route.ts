import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

// GET /api/users/[id]
export async function GET(_: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    if(!id) throw new NotFoundError("User");

    try {
        await dbConnect();

        const user = await User.findById(id);

        if(!user) {
            throw new NotFoundError("User");
        };

        return NextResponse.json({ success: true, data: User }, { status: 200 })

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
};


// DELETE /api/users/[id]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    if(!id) throw new NotFoundError("User");

    try {
        await dbConnect();

        const user = await User.findByIdAndDelete(id);

        if(!user) throw new NotFoundError("User");

        // We're returning the data of the deleted user for scenarios where we want display "User SNG66 was deleted"
        return NextResponse.json({ success: true, data: user }, { status: 204 });

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }

    
}


// PUT /api/users/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    if(!id) throw new NotFoundError("User");

    try {
        await dbConnect();

        // Validating data first
        const body = await request.json();
        const validatedData = UserSchema.partial().parse(body);

        // By default, findOneAndUpdate() returns the document as it was before update was applied. 
        // If you set new: true, findOneAndUpdate() will instead give you the object after update was applied
        const updatedUser  = await User.findByIdAndUpdate(id, validatedData, { new: true });

        if(!updatedUser ) throw new NotFoundError("User");

        return NextResponse.json({ success: true, data: updatedUser }, { status: 200})

    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}