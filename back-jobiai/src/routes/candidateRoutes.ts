import express from "express";
import { auth } from "../middlewares/authMiddleware";
import {
    createCandidateProfile,
    getAllCandidateProfiles,
    getCandidateProfileById,
    updateCandidateProfile,
    deleteCandidateProfile,
    getCandidateProfileByUser
} from "../controllers/candidateController";

const router = express.Router();

// @ts-ignore
router.post("/add", auth, createCandidateProfile); // 🔹 Créer un profil candidat
// @ts-ignore
router.get("/", auth, getCandidateProfileByUser); // 🔹 Récupérer le profil du candidat connecté

// Routes publiques
router.get("/all", getAllCandidateProfiles); // 🔹 Récupérer tous les profils candidats
// @ts-ignore
router.get("/:id", getCandidateProfileById); // 🔹 Récupérer un profil candidat par ID
// @ts-ignore
router.put("/:id", updateCandidateProfile); // 🔹 Mettre à jour un profil candidat
// @ts-ignore
router.delete("/:id", deleteCandidateProfile); // 🔹 Supprimer un profil candidat

export default router;
