import { Request, Response } from "express";
import Company from "../models/Company";
import { AuthRequest } from "../middlewares/authMiddleware"; // Middleware d'auth
import express from 'express';
import { createUploader } from '../middlewares/upload';
import mongoose from "mongoose";

const router = express.Router();
export const uploadLogo = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const logoUrl = `${req.protocol}://${req.get('host')}/uploads/logos/${req.file.filename}`;
    return res.status(200).json({ logoUrl });
};










// 📌 Créer une entreprise liée à l'utilisateur connecté
export const createCompany = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const newCompany = new Company({
            ...req.body,
            createdBy: req.user.id
        });

        await newCompany.save();
        res.status(201).json({ message: "Entreprise créée avec succès", company: newCompany });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création", error });
    }
};
export const getCompanyByUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        console.log("Received userId:", userId);
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const company = await Company.findOne({ createdBy: userId });

        if (!company) {
            return res.status(404).json({ message: "Aucune entreprise trouvée pour cet utilisateur" });
        }

        res.status(200).json(company);
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        res.status(500).json({ message: "Erreur lors de la récupération", error });
    }
};




// 📌 Récupérer toutes les entreprises
export const getAllCompanies = async (req: Request, res: Response) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des entreprises", error });
    }
};

// 📌 Récupérer une entreprise par ID
export const getCompanyById = async (req: Request, res: Response) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Entreprise non trouvée" });
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'entreprise", error });
    }
};
// 📌 Get company by user ID

export const getCompanyByUserId = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    console.log("Received userId:", userId); // <--- Ajoute ça pour confirmation
    console.log("Is valid ObjectId:", mongoose.Types.ObjectId.isValid(userId));


    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const company = await Company.findOne({ createdBy: userId });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.json(company);
    } catch (error) {
        console.error("Error getting company:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// 📌 Mettre à jour une entreprise
export const updateCompany = async (req: Request, res: Response) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCompany) {
            return res.status(404).json({ message: "Entreprise non trouvée" });
        }
        res.status(200).json({ message: "Entreprise mise à jour", company: updatedCompany });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'entreprise", error });
    }
};

// 📌 Supprimer une entreprise
export const deleteCompany = async (req: Request, res: Response) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(req.params.id);
        if (!deletedCompany) {
            return res.status(404).json({ message: "Entreprise non trouvée" });
        }
        res.status(200).json({ message: "Entreprise supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'entreprise", error });
    }
};
