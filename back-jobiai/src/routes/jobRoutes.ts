import express from "express";
import { auth } from "../middlewares/authMiddleware";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} from "../controllers/jobController";

const router = express.Router();

// @ts-ignore
router.post("/add", auth, createJob); // 🔹 Créer une offre d'emploi
// @ts-ignore
router.get("/all", getAllJobs); // 🔹 Récupérer toutes les offres d'emploi
// @ts-ignore
router.get("/:id", getJobById); // 🔹 Récupérer une offre d'emploi par ID
// @ts-ignore
router.put("/:id", auth, updateJob); // 🔹 Mettre à jour une offre d'emploi
// @ts-ignore
router.delete("/:id", auth, deleteJob); // 🔹 Supprimer une offre d'emploi

export default router;