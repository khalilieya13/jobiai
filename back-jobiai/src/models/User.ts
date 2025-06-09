import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role: "admin" | "candidate" | "recruiter";
    username: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "candidate", "recruiter"], default: "candidate" },
    username: { type: String, required: true }
});

export default mongoose.model<IUser>("users", UserSchema);
