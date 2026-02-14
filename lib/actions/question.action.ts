"use server";

import { ActionResponse, CreateQuestionParams, ErrorResponse } from "@/types/global";
import { AskQuestionSchema } from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { UnauthorizedError, ValidationError } from "../http-errors";
import QuestionTag from "@/database/tag-question.model";


export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse> {
    const validationResult = await action({params, schema: AskQuestionSchema, authorize: true});

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    } else if(validationResult instanceof ValidationError) {
        return handleError(validationResult) as ErrorResponse;
    } else if(validationResult instanceof UnauthorizedError) {
        return handleError(validationResult) as ErrorResponse;
    } 

    const { title, content, tags } = validationResult.params;
    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [question] = await Question.create([{ title, content, author: userId}], { session });

        if(!question) {
            throw new Error("Failed to create question");
        }

        const tagIds: mongoose.Types.ObjectId[] = [];
        const tagQuestionDocuments = [];

        for (const tag of tags) {
            // note: If the tag doesn't exist we insert a new tag using "$setOnIsert"
            // if it exists we increment the number of question related to that tag by 1 (one) using "$inc"

            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // looking for a tag that its name is a regular expresion
                
                { $setOnInsert: { name: tag }, $inc: { question: 1}}, // if we dont find it, insert new one and increment 1
                { upsert: true, new: true, session}
            );

            tagIds.push(existingTag._id);
            tagQuestionDocuments.push(
                {
                    tag: existingTag._id,
                    question: question._id,
                }
            )
        };

        await QuestionTag.insertMany(tagQuestionDocuments, { session });

        await Question.findByIdAndUpdate(
            question._id, // finding question by id
            { $push: { tags: { $each: tagIds }}}, // update the tags by pushing each of the tags within our array
            { session }
        );

        await session.commitTransaction();

        return { 
            success: true,
            data: JSON.parse(JSON.stringify(question))
        };

    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
}