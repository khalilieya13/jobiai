import mongoose, { Document } from "mongoose";

export interface ICandidate extends Document {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
    experienceYears: number;
    skills: string[]; // Ajout du champ skills
    createdBy: mongoose.Schema.Types.ObjectId;
}

const CandidateSchema = new mongoose.Schema<ICandidate>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    skills: {
        type: [String], // Tableau de compétences
        default: []
    },
    experienceYears: {
        type: Number,
        required: false,
        default: 0,
        min: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

export default mongoose.model<ICandidate>("Candidate", CandidateSchema);
