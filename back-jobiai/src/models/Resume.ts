import mongoose, { Document } from "mongoose";

export interface IResume extends Document {
    personalInfo: {
        fullName: string;
        title: string;
        email: string;
        phone: string;
        address: string;
        summary: string;
    };
    education: {
        title: string;
        type: 'diploma' | 'training';
        institution: string;
        startYear: string;
        endYear: string;
        description: string;
    }[];
    experience: {
        company: string;
        position: string;
        location: string;
        startYear: string;
        endYear: string;
        description: string;
    }[];
    skills: {
        name: string;
        level: number;
    }[];
    accreditations: {
        title: string;
        organization: string;
        year: string;
        description: string;
    }[];
    languages: {
        language: string;
        proficiency: string;
    }[];
    interests: string[];
    links: {
        title: string;
        url: string;
    }[];
    createdBy: mongoose.Schema.Types.ObjectId;
}

const ResumeSchema = new mongoose.Schema<IResume>({
    personalInfo: {
        fullName: { type: String, required: true },
        title: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
        },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        summary: { type: String, required: true }
    },
    education: [{
        title: { type: String, required: true },
        type: { type: String, enum: ['diploma', 'training'], required: true },
        institution: { type: String, required: true },
        startYear: { type: String, required: true },
        endYear: { type: String, required: true },
        description: { type: String, required: true }
    }],
    experience: [{
        company: { type: String, required: true },
        position: { type: String, required: true },
        location: { type: String, required: true },
        startYear: { type: String, required: true },
        endYear: { type: String, required: true },
        description: { type: String, required: true }
    }],
    skills: [{
        name: { type: String, required: true },
        level: { type: Number, required: true, min: 1, max: 5 }
    }],
    accreditations: [{
        title: { type: String, required: true },
        organization: { type: String, required: true },
        year: { type: String, required: true },
        description: { type: String, required: true }
    }],
    languages: [{
        language: { type: String, required: true },
        proficiency: { type: String, required: true }
    }],
    interests: [{ type: String }],
    links: [{
        title: { type: String, required: true },
        url: { type: String, required: true }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt
});

export default mongoose.model<IResume>("Resume", ResumeSchema);
