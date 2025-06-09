import express from "express";
import { auth } from "../middlewares/authMiddleware";
import {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getCompanyByUser, getCompanyByUserId
} from "../controllers/companyController";
import { uploadLogo } from "../controllers/companyController";
import { createUploader } from "../middlewares/upload";


const router = express.Router();


// @ts-ignore
router.post("/add",auth, createCompany); // 🔹 Créer une entreprise
// @ts-ignore
router.get("/",auth, getCompanyByUser); // 🔹 Récupérer les entreprises de l'utilisateur connecté

// Routes publiques
router.get("/all", getAllCompanies); // 🔹 Récupérer toutes les entreprises
// @ts-ignore
router.get("/:id", getCompanyById); // 🔹 Récupérer une entreprise par ID
// @ts-ignore
router.put("/:id",  updateCompany); // 🔹 Mettre à jour une entreprise
// @ts-ignore
router.delete("/:id", deleteCompany); // 🔹 Supprimer une entreprise
// @ts-ignore
router.get("/user/:userId", getCompanyByUserId);

const logoUploader = createUploader("logos", ["image/jpeg", "image/png"]);
// @ts-ignore
router.post("/upload-logo", logoUploader.single("logo"), uploadLogo);

export default router;
