import { model, models, Schema, Types, HydratedDocument } from "mongoose";

// Purpose of this model:
// A user can be authentciated through the account, for each one of the providers on its own
// Like we can have a single user named "John Doe", and then they can have multiple accounts through different providers
// This allows users to connect through multiple login options while keeping their primary user info separated

export interface IAccount {
    user: Types.ObjectId;
    name: string;
    image?: string;
    password?: string;
    provider: string;
    providerAccountId: string
};


export type IAccountDoc = HydratedDocument<IAccount>

const AccountSchema = new Schema<IAccount>({
    user: { type: Schema.Types.ObjectId, ref: "User", required:true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    }, { timestamps: true }
);

const Account = models?.Account || model<IAccount>("Account", AccountSchema);


export default Account;