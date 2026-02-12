import { model, models, Schema, Types, HydratedDocument } from "mongoose";

// This model is to let the user to store/bookmark question that they might find helful

export interface ICollection {
    author: Types.ObjectId;
    question: Types.ObjectId;
}

 export type ICollectionDoc = HydratedDocument<ICollection>

const CollectionSchema = new Schema<ICollection>({
    author: { type: Schema.Types.ObjectId, ref:"User", required: true },
    question: { type: Schema.Types.ObjectId, ref:"Question", required: true},
}, { timestamps: true} 
);


const Collection = models?.Collection || model<ICollection>("Collection", CollectionSchema);


export default Collection;