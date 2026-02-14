"use server";

import z, { ZodError, ZodType } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "../mongoose";


type ActionOptions<T> = {
    params: T,
    schema: ZodType<T>,
    authorize: boolean,

};

// 1. Check wether the schema and params are provided and validated
// 2. Checking wether the user is authorized.
// 3. Connecting to db
// 4. Return the params and session.

async function action<T>({
    params,
    schema,
    authorize = false,
}: ActionOptions<T>) {
    // 1
    try {
        schema.parse(params);
    } catch (error) {
        if (error instanceof ZodError) {
            const flattered = z.flattenError(error);
            return new  ValidationError(flattered.fieldErrors);
        } else {
            return new Error("Schema validation failed");
        }
    };

    // 2
    let session: Session | null = null;

    if (authorize) {
        // Before triying any server action, try to authorize the user
        session = await auth();

        if(!session) {
            return new UnauthorizedError();
        };
    };

    // 3
    await dbConnect();

    // 4
    return { params, session };
}

export default action;