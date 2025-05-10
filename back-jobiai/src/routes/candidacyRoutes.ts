import express from "express";
import { auth } from "../middlewares/authMiddleware";
import {
    applyToJob,
    getCandidaciesByCandidate,
    getCandidaciesByJobPost,
    updateCandidacyStatus,
    deleteCandidacy
} from "../controllers/candidacyController";

const router = express.Router();

// @ts-ignore
router.post("/apply", auth, applyToJob); // 🔹 Postuler à une offre d'emploi
// @ts-ignore
router.get("/", auth, getCandidaciesByCandidate); // 🔹 Récupérer les candidatures du candidat connecté
// @ts-ignore
router.get("/job/:jobPostId", getCandidaciesByJobPost); // 🔹 Récupérer les candidatures pour une offre
// @ts-ignore
router.put("/:id", updateCandidacyStatus); // 🔹 Mettre à jour le statut d'une candidature
// @ts-ignore
router.delete("/:id", deleteCandidacy); // 🔹 Supprimer une candidature



export default router;
