import express from "express";
import { auth } from "../middlewares/authMiddleware";
import {
    createResume,
    getAllResumes,
    getResumeById,
    updateResume,
    deleteResume,
    getResumeByUser, searchResumes, uploadPdfAndCreateResume, getResumeByUserId
} from "../controllers/resumeController";

import { createUploader } from "../middlewares/upload";


const router = express.Router();

// @ts-ignore
router.post("/add", auth, createResume); // 🔹 Créer un CV
// @ts-ignore
router.get("/", auth, getResumeByUser); // 🔹 Récupérer le CV de l'utilisateur connecté

// Routes publiques
router.get("/all", getAllResumes); // 🔹 Récupérer tous les CVs
// @ts-ignore
router.get("/:id", getResumeById); // 🔹 Récupérer un CV par ID
// @ts-ignore
router.put("/:id", updateResume); // 🔹 Mettre à jour un CV
// @ts-ignore
router.delete("/:id", deleteResume); // 🔹 Supprimer un CV

router.get("/search", searchResumes);
// @ts-ignore
router.get("/user/:userId", auth, getResumeByUserId);


const pdfUploader = createUploader("pdfs", ["application/pdf"]);
// @ts-ignore
router.post("/upload-pdf", auth, pdfUploader.single("file"), uploadPdfAndCreateResume);

export default router;
