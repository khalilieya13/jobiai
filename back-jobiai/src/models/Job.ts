import mongoose, { Document } from "mongoose";

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
    idCompany: mongoose.Schema.Types.ObjectId; // Référence vers Company
    createdAt?: Date; // Ajouté automatiquement
    updatedAt?: Date; // (optionnel mais généré aussi)
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
        idCompany: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }
    },
    { timestamps: true } // <-- Active createdAt et updatedAt automatiquement
);

export default mongoose.model<IJob>("Job", JobSchema);
