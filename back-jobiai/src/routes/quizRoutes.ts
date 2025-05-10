import express from "express";
import { auth } from "../middlewares/authMiddleware";
import {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getQuizzesByJob
} from "../controllers/quizController";

const router = express.Router();

// @ts-ignore
router.post("/add", auth, createQuiz); // 🔹 Créer un quiz lié à une offre d'emploi
// @ts-ignore
router.get("/all", getAllQuizzes); // 🔹 Récupérer tous les quiz
// @ts-ignore
router.get("/job/:jobId", getQuizzesByJob); // 🔹 Récupérer tous les quiz liés à un job
// @ts-ignore
router.get("/:id", getQuizById); // 🔹 Récupérer un quiz par ID
// @ts-ignore
router.put("/:id", auth, updateQuiz); // 🔹 Mettre à jour un quiz
// @ts-ignore
router.delete("/:id", auth, deleteQuiz); // 🔹 Supprimer un quiz

export default router;
