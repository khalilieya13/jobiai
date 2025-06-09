import mongoose, { Document } from "mongoose";

import { IUser } from './User';
export interface ICompany extends Document {
    name: string;
    logo?: string;
    location: string;
    website?: string;
    size: string;
    industry: string;
    founded: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    createdBy: mongoose.Types.ObjectId | IUser; // 🔹 Lien avec User
}

const CompanySchema = new mongoose.Schema<ICompany>({
    name: { type: String, required: true },
    logo: { type: String },
    location: { type: String, required: true },
    website: { type: String },
    size: { type: String, required: true },
    industry: { type: String, required: true },
    founded: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true } // 🔗 Référence User
});

export default mongoose.model<ICompany>("Company", CompanySchema);
