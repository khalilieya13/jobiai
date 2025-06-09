import { Request, Response } from "express";
import Resume from "../models/Resume";
import { AuthRequest } from "../middlewares/authMiddleware"; // Middleware d'auth
import mongoose from 'mongoose';
export const getResumeByUserId = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    console.log("Received userId:", userId);

    // Vérification que userId est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        // Recherche du CV lié à cet utilisateur
        const resume = await Resume.findOne({ createdBy: userId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found for this user" });
        }

        return res.status(200).json(resume);
    } catch (error) {
        console.error("Error fetching resume:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};
export const uploadPdfAndCreateResume = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier uploadé" });
        }

        const pdfUrl = `${req.protocol}://${req.get('host')}/uploads/pdfs/${req.file.filename}`;

        console.log("Reçu dans req.body:", req.body); // debug temporaire

        const newResume = new Resume({
            personalInfo: {
                fullName: req.body.fullName || "Nom inconnu",
                title: req.body.title || "Titre non spécifié",
                email: req.body.email || "email@inconnu.com",
                phone: req.body.phone || "Téléphone non spécifié",
                address: req.body.address || "Adresse non spécifiée",
                summary: req.body.summary || "Résumé non fourni"
            },
            resumeFileUrl: pdfUrl,
            createdBy: req.user.id,
            isFromPdf: true
        });

        await newResume.save();

        res.status(201).json({ message: "CV créé avec succès", resume: newResume });
    } catch (error) {
        console.error("Erreur lors de la création du CV :", error);
        res.status(500).json({ message: "Erreur lors de la création du CV", error });
    }
};



// 📌 Créer un CV lié à l'utilisateur connecté
export const createResume = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const newResume = new Resume({
            ...req.body,
            createdBy: req.user.id
        });

        await newResume.save();
        res.status(201).json({ message: "CV créé avec succès", resume: newResume });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du CV", error });
    }
};

// 📌 Récupérer le CV d'un utilisateur connecté
export const getResumeByUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const resume = await Resume.findOne({ createdBy: req.user.id });

        if (!resume) {
            return res.status(404).json({ message: "Aucun CV trouvé pour cet utilisateur" });
        }

        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du CV", error });
    }
};

// 📌 Récupérer tous les CVs
export const getAllResumes = async (req: Request, res: Response) => {
    try {
        const resumes = await Resume.find();
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des CVs", error });
    }
};

// 📌 Récupérer un CV par ID
export const getResumeById = async (req: Request, res: Response) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: "CV non trouvé" });
        }
        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du CV", error });
    }
};

// 📌 Mettre à jour un CV
export const updateResume = async (req: Request, res: Response) => {
    try {
        const updatedResume = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
        if (!updatedResume) {
            return res.status(404).json({ message: "CV non trouvé" });
        }
        res.status(200).json({ message: "CV mis à jour", resume: updatedResume });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du CV", error });
    }
};

// 📌 Supprimer un CV
export const deleteResume = async (req: Request, res: Response) => {
    try {
        const deletedResume = await Resume.findByIdAndDelete(req.params.id);
        if (!deletedResume) {
            return res.status(404).json({ message: "CV non trouvé" });
        }
        res.status(200).json({ message: "CV supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du CV", error });
    }
};
// Exemple : GET /resume/search?skills=React,Node.js&experience=Senior Level
export const searchResumes = async (req: Request, res: Response) => {
    try {
        const query: any = {};

        if (req.query.skills) {
            query['skills.name'] = { $in: (req.query.skills as string).split(',') };
        }

        if (req.query.education) {
            query['education.title'] = { $in: (req.query.education as string).split(',') };
        }

        if (req.query.experienceLevel) {
            query['experience.level'] = { $in: (req.query.experienceLevel as string).split(',') };
        }

        const resumes = await Resume.find(query);
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche de CV', error });
    }
};

