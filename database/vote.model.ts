import { model, models, Schema, Types } from "mongoose";

export interface IVote {
    author: Types.ObjectId;
    id: Types.ObjectId;
    type: "question" | "answer";
    voteType: "upvote" | "downvote";
}

const VoteSchema = new Schema<IVote>({
    author: { type: Schema.Types.ObjectId, ref: "User", required:true },
    id: { type: Schema.Types.ObjectId, required:true },
    type: { type: String, enum: ["question", "answer"], required: true },  // This means that the string can be only one of those two thing, question or answer
    voteType: { type: String, required: true } // upvote or downvote
}, { timestamps: true} 
);


const Vote = models?.Vote || model<IVote>("QuestionTag", VoteSchema);


export default Vote;