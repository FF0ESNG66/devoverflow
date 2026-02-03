import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http-errors";
import { z, ZodError } from "zod";

export type ResponseType = "api" | "server";

const formatResponse = (
    responseType: ResponseType,
    status: number,
    message: string,
    errors?: Record<string, string[]> | undefined,
) => {
    const responseContent = {
        success: false,
        error: {
            message,
            details: errors,
        },
    };

    return responseType === "api"
    ? NextResponse.json(responseContent, {status})
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {

    // checking if the error is the class that we created
    if(error instanceof RequestError) {
        return formatResponse(responseType, error.statusCode, error.message, error.errors)
    }

    if (error instanceof ZodError) {
        const validationError = new ValidationError(
        z.treeifyError(error) as Record<string, string[]>
        );

        return formatResponse(
        responseType,
        validationError.statusCode,
        validationError.message,
        validationError.errors
        );
    }

    if(error instanceof Error) {
        return formatResponse(
            responseType,
            500,
            error.message
        )
    }

    return formatResponse(responseType, 500, "An unspected error ocurred");
};

export default handleError;