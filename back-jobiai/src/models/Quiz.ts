import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
    text: string;
    type: "multiple-choice" | "true-false" ;
    options?: string[];
    correctAnswer: string | boolean;
    points: number;
}

export interface IQuiz extends Document {
    title: string;
    description?: string;
    jobPostId: mongoose.Schema.Types.ObjectId; // Référence vers Job
    duration: number; // Durée en minutes
    score:number;
    timeTaken:number;
    questions: IQuestion[];
    createdBy?: string; // Si tu veux lier à un user dans le futur
    createdAt?: Date;
    updatedAt?: Date;
}

const QuestionSchema = new Schema<IQuestion>(
    {
        text: { type: String, required: true },
        type: { type: String, enum: ["multiple-choice", "true-false"], required: true },
        options: [{ type: String }],
        correctAnswer: { type: Schema.Types.Mixed },
        points: { type: Number, required: true }
    },
    { _id: false } // Pas besoin d'un ID pour chaque question
);

const QuizSchema = new Schema<IQuiz>(
    {
        title: { type: String, required: true },
        description: { type: String },
        jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
        duration: { type: Number, default: 30 },
        score: { type: Number},
        timeTaken: { type: Number},
        questions: [QuestionSchema],
        createdBy: { type: String }
    },
    { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
