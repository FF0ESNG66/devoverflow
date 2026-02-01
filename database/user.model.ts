import { model, models, Schema } from "mongoose";


// stands for "interface User", to differentiate it from User which is the model
// Now whenever you create a new model, on the frontend, it'll know which properties you have access to
export interface IUser {
    name: string;
    username: string;
    email: string;
    bio?: string;
    image: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
}

// Defining model's SCHEMA like django
const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String, required: true},
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
    }, { timestamps: true } // This will generate timestamp of when the user was created
)

// Now that we have the schema, we define the MODEL
const User = models?.user || model<IUser>("User", UserSchema);


// Note
// "models" is going to give uis access to all the currently >created< models 
// so instead of creating one every single time, we check if one already exists
// if so we use that, if not then we create a new one


export default User;