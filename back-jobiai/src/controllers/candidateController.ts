import { Request, Response } from "express";
import Candidate from "../models/Candidate";
import { AuthRequest } from "../middlewares/authMiddleware"; // Middleware d'auth

// 📌 Créer un profil candidat lié à l'utilisateur connecté
export const createCandidateProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const newProfile = new Candidate({
            ...req.body,
            skills: req.body.skills || [],
            createdBy: req.user.id
        });

        await newProfile.save();
        res.status(201).json({ message: "Profil candidat créé avec succès", profile: newProfile });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du profil", error });
    }
};

// 📌 Récupérer le profil d'un candidat par utilisateur
export const getCandidateProfileByUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const profile = await Candidate.findOne({ createdBy: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: "Aucun profil trouvé pour cet utilisateur" });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil", error });
    }
};

// 📌 Récupérer tous les profils candidats
export const getAllCandidateProfiles = async (req: Request, res: Response) => {
    try {
        const profiles = await Candidate.find();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des profils", error });
    }
};

// 📌 Récupérer un profil candidat par ID
export const getCandidateProfileById = async (req: Request, res: Response) => {
    try {
        const profile = await Candidate.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: "Profil non trouvé" });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil", error });
    }
};

// 📌 Mettre à jour un profil candidat
export const updateCandidateProfile = async (req: Request, res: Response) => {
    try {
        const updatedProfile = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true,upsert: true  });
        if (!updatedProfile) {
            return res.status(404).json({ message: "Profil non trouvé" });
        }
        res.status(200).json({ message: "Profil mis à jour", profile: updatedProfile });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error });
    }
};

// 📌 Supprimer un profil candidat
export const deleteCandidateProfile = async (req: Request, res: Response) => {
    try {
        const deletedProfile = await Candidate.findByIdAndDelete(req.params.id);
        if (!deletedProfile) {
            return res.status(404).json({ message: "Profil non trouvé" });
        }
        res.status(200).json({ message: "Profil supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du profil", error });
    }
};
