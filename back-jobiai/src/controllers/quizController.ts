import { Request, Response } from "express";
import Quiz from "../models/Quiz";
import Job from "../models/Job";
import { AuthRequest } from "../middlewares/authMiddleware";
import mongoose from "mongoose";

// 📌 Créer un quiz lié à une offre d'emploi
export const createQuiz = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, jobPostId, duration, questions } = req.body;

        // Vérifier si le job existe
        const job = await Job.findById(jobPostId);
        if (!job) {
            return res.status(404).json({ message: "Offre d'emploi introuvable" });
        }

        const newQuiz = new Quiz({
            title,
            description,
            jobPostId,
            duration,
            questions,
            createdBy: req.user?.id // facultatif
        });

        await newQuiz.save();
        res.status(201).json({ message: "Quiz créé avec succès", quiz: newQuiz });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du quiz", error });
    }
};

// 📌 Récupérer tous les quiz
export const getAllQuizzes = async (req: Request, res: Response) => {
    try {
        const quizzes = await Quiz.find().populate("jobPostId");
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des quiz", error });
    }
};

// 📌 Récupérer un quiz par ID
export const getQuizById = async (req: Request, res: Response) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate("jobPostId");
        if (!quiz) {
            return res.status(404).json({ message: "Quiz non trouvé" });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du quiz", error });
    }
};

// 📌 Mettre à jour un quiz
export const updateQuiz = async (req: Request, res: Response) => {
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedQuiz) {
            return res.status(404).json({ message: "Quiz non trouvé" });
        }
        res.status(200).json({ message: "Quiz mis à jour", quiz: updatedQuiz });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du quiz", error });
    }
};

// 📌 Supprimer un quiz
export const deleteQuiz = async (req: Request, res: Response) => {
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!deletedQuiz) {
            return res.status(404).json({ message: "Quiz non trouvé" });
        }
        res.status(200).json({ message: "Quiz supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du quiz", error });
    }
};

// 📌 Récupérer les quiz liés à une offre d'emploi
export const getQuizzesByJob = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.jobId;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "ID de job invalide" });
        }

        const quizzes = await Quiz.find({ jobPostId: jobId });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des quiz", error });
    }
};
