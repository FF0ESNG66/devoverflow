import { model, models, Schema, Types } from "mongoose";

export interface IQuestion {
    title: string;
    content: string;
    tags: Types.ObjectId[];
    views?: number;
    upvotes?: number;
    downvotes?: number;
    author: Types.ObjectId;
    answers?: number;
    
}

const QuestionSchema = new Schema<IQuestion>({
    title: { type: String, required: true },
    content: { type: String, required: true},
    tags: [{ type: Schema.Types.ObjectId, ref: "Tags", required: true}],
    views: {type: Number, default: 0},
    upvotes: {type: Number, required: true, default:0 },
    downvotes: {type: Number, required: true, default:0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true},
    answers: {type: Number,  ref: "Answers"},
}, { timestamps: true} 
);


const Question = models?.Question || model<IQuestion>("Question", QuestionSchema);


export default Question;