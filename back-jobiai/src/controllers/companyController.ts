import { Request, Response } from "express";
import Company from "../models/Company";
import { AuthRequest } from "../middlewares/authMiddleware"; // Middleware d'auth

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
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const company = await Company.findOne({ createdBy: req.user.id });

        if (!company) {
            return res.status(404).json({ message: "Aucune entreprise trouvée pour cet utilisateur" });
        }

        res.status(200).json(company);
    } catch (error) {
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
