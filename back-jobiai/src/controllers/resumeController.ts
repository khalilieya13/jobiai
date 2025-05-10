import { Request, Response } from "express";
import Resume from "../models/Resume";
import { AuthRequest } from "../middlewares/authMiddleware"; // Middleware d'auth

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

