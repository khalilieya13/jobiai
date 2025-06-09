import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizResponse extends Document {
    quizId: mongoose.Types.ObjectId;
    candidateId: mongoose.Types.ObjectId; // fait référence à un User

    score: number;
    timeTaken: number;
    submittedAt: Date;
}

const QuizResponseSchema: Schema = new Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // ici c'est la référence à la collection des utilisateurs
        required: true
    },

    score: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number,
        required: true // en secondes
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IQuizResponse>('QuizResponse', QuizResponseSchema);
