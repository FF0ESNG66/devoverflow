import { model, models, Schema, Types, Document } from "mongoose";

export interface IVote {
    author: Types.ObjectId;
    actionId: Types.ObjectId;
    actionType: "question" | "answer";
    voteType: "upvote" | "downvote";
}

 export interface IVoteDoc extends IVote, Document {}

const VoteSchema = new Schema<IVote>({
    author: { type: Schema.Types.ObjectId, ref: "User", required:true },
    actionId: { type: Schema.Types.ObjectId, required:true },
    actionType: { type: String, enum: ["question", "answer"], required: true },  // This means that the string can be only one of those two thing, question or answer
    voteType: { type: String, required: true } // upvote or downvote
}, { timestamps: true} 
);


const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);


export default Vote;