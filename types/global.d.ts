import { NextResponse } from "next/server";

interface Tag {
    _id: string;
    name: string;
}

interface Author {
    _id: string;
    name: string;
    imgUrl: string;
}

interface Question {
    _id: string;
    title: string;
    tags: Tag[];
    author: Author;
    createdAt: Date;
    upvotes: number;
    answers: number;
    views: number;
}

// With this we can know exactly how each one of our responses is goint to look like
type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: Record<string, string[]>  // This is common for form validations
    },
    status?: number;
}

// Everything from ActionResponse<T> PLUS a constraint in success
type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

// Wrapping types in NextResponse. One if for guaranteed failed responses
// such as catch in trycatch blocks and the other ones for responses that may success or not (such as the try in trycatch blocks)
type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

