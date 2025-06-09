import mongoose, { Document } from "mongoose";
import { ICompany } from './Company';

export interface IJob extends Document {
    jobTitle: string;
    department: string;
    location: string;
    employmentType: string;
    workMode: string; // Remote, On-site, Hybrid
    experienceLevel: string;
    salaryRange: {
        min: number;
        max: number;
    };
    requiredSkills: string[];
    jobDescription: string;
    idCompany: ICompany; // Référence vers Company
    status: "Active" | "Paused" | "Closed"; // <-- Ajouté ici
    createdAt?: Date;
    updatedAt?: Date;
    recommendations?: {
        resumes: { resumeId: mongoose.Schema.Types.ObjectId; score: number }[];
    };

}

const JobSchema = new mongoose.Schema<IJob>(
    {
        jobTitle: { type: String, required: true },
        department: { type: String, required: true },
        location: { type: String, required: true },
        employmentType: { type: String, required: true },
        workMode: { type: String, required: true },
        experienceLevel: { type: String, required: true },
        salaryRange: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        },
        requiredSkills: { type: [String], required: true },
        jobDescription: { type: String, required: true },
        idCompany: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
        status: {
            type: String,
            enum: ["Active", "Paused", "Closed"],
            default: "Active"
        },
        recommendations: {
            resumes: [
                {
                    resumeId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Resume", // ou "Resume"
                        required: true
                    },
                    score: {
                        type: Number,
                        required: true
                    }
                }
            ]
        }
    },
    { timestamps: true }
);


export default mongoose.model<IJob>("Jobs", JobSchema);
