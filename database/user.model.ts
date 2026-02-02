import { model, models, Schema, Document } from "mongoose";


// stands for "interface User", to differentiate it from User which is the model
// Now whenever you create a new model, on the frontend, it'll know which properties you have access to
export interface IUser {
    name: string;
    username: string;
    email: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
}

// Creating an intersection interface/type so we can access fields like _id or id or any virtual methods provided by Mongoose on any kind of model.
// henever we need to access any default Mongoose-specific fields, we’ll use this interface to define types for that result and make it typesafe.
export interface IUserDoc extends IUser, Document {}

// Defining model's SCHEMA like django
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String},
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
    }, { timestamps: true } // This will generate timestamp of when the user was created
)

// Now that we have the schema, we define the MODEL
const User = models?.User || model<IUser>("User", UserSchema);


// Note
// "models" is going to give uis access to all the currently >created< models 
// so instead of creating one every single time, we check if one already exists
// if so we use that, if not then we create a new one


export default User;