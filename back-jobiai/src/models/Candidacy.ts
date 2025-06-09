import mongoose, { Document } from "mongoose";

export interface ICandidacy extends Document {
    jobPost: mongoose.Schema.Types.ObjectId;
    candidate: mongoose.Schema.Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
    appliedAt: Date;
}

const CandidacySchema = new mongoose.Schema<ICandidacy>({
    jobPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs", // Référence au modèle des offres d'emploi
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Référence au modèle "users" (en minuscules pour correspondre à votre modèle User)
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model<ICandidacy>("Candidacy", CandidacySchema);
