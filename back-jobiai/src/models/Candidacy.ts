import mongoose, { Document } from "mongoose";

export interface ICandidacy extends Document {
    jobPost: mongoose.Schema.Types.ObjectId;
    candidate: mongoose.Schema.Types.ObjectId;
    status: "pending" | "accepted" | "rejected"; // Statut de la candidature
    appliedAt: Date;
}

const CandidacySchema = new mongoose.Schema<ICandidacy>({
    jobPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job", // Référence au modèle des offres d'emploi
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Référence au modèle des candidats
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending" // Par défaut, la candidature est en attente
    },
    appliedAt: {
        type: Date,
        default: Date.now // Date de candidature par défaut
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

export default mongoose.model<ICandidacy>("Candidacy", CandidacySchema);
