import { Request, Response } from "express";
import Candidacy from "../models/Candidacy";
import { AuthRequest } from "../middlewares/authMiddleware"; // Middleware d'auth

// 📌 Postuler à une offre d'emploi
export const applyToJob = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const { jobPost } = req.body;

        if (!jobPost) {
            return res.status(400).json({ message: "L'ID de l'offre d'emploi est requis" });
        }

        // Vérifier si le candidat a déjà postulé
        const existingCandidacy = await Candidacy.findOne({ jobPost, candidate: req.user.id });
        if (existingCandidacy) {
            return res.status(400).json({ message: "Vous avez déjà postulé à cette offre" });
        }

        const newCandidacy = new Candidacy({
            jobPost,
            candidate: req.user.id,
            status: "pending",
            appliedAt: new Date()
        });

        await newCandidacy.save();
        res.status(201).json({ message: "Candidature envoyée avec succès", candidacy: newCandidacy });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la candidature", error });
    }
};

// 📌 Récupérer les candidatures d'un candidat
export const getCandidaciesByCandidate = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const candidacies = await Candidacy.find({ candidate: req.user.id }).populate("jobPost");
        res.status(200).json(candidacies);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des candidatures", error });
    }
};

// 📌 Récupérer toutes les candidatures pour une offre d'emploi
export const getCandidaciesByJobPost = async (req: Request, res: Response) => {
    try {
        const { jobPostId } = req.params;

        const candidacies = await Candidacy.find({ jobPost: jobPostId });
        res.status(200).json(candidacies);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des candidatures", error });
    }
};

// 📌 Mettre à jour le statut d'une candidature (ex: accepté/rejeté)
export const updateCandidacyStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        const updatedCandidacy = await Candidacy.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedCandidacy) {
            return res.status(404).json({ message: "Candidature non trouvée" });
        }

        res.status(200).json({ message: "Statut mis à jour", candidacy: updatedCandidacy });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
};

// 📌 Supprimer une candidature
export const deleteCandidacy = async (req: Request, res: Response) => {
    try {
        const deletedCandidacy = await Candidacy.findByIdAndDelete(req.params.id);
        if (!deletedCandidacy) {
            return res.status(404).json({ message: "Candidature non trouvée" });
        }
        res.status(200).json({ message: "Candidature supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
};
