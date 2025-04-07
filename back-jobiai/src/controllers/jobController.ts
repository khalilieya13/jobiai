import { Request, Response } from "express";
import Job from "../models/Job";
import { AuthRequest } from "../middlewares/authMiddleware";
import axios from "axios";

// 📌 Créer un job lié à l'entreprise de l'utilisateur connecté
export const createJob = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }
        // Récupérer l'entreprise de l'utilisateur via son token
        const companyResponse = await axios.get("http://localhost:5000/jobiai/api/company", {
            headers: { Authorization: req.headers.authorization }
        });

        if (!companyResponse.data) {
            return res.status(404).json({ message: "Entreprise non trouvée" });
        }
        const { jobTitle, department, location, employmentType, workMode, experienceLevel, salaryRange, requiredSkills, jobDescription } = req.body;

        const newJob = new Job({
            jobTitle,
            department,
            location,
            employmentType,
            workMode,
            experienceLevel,
            salaryRange,
            requiredSkills,
            jobDescription,
            idCompany: companyResponse.data._id
        });

        await newJob.save();
        res.status(201).json({ message: "Offre d'emploi créée avec succès", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'offre", error });
    }
};

// 📌 Récupérer tous les jobs
export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find().populate("idCompany");
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des offres", error });
    }
};

// 📌 Récupérer un job par ID
export const getJobById = async (req: Request, res: Response) => {
    try {
        const job = await Job.findById(req.params.id).populate("idCompany");
        if (!job) {
            return res.status(404).json({ message: "Offre d'emploi non trouvée" });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'offre", error });
    }
};

// 📌 Mettre à jour une offre d'emploi
export const updateJob = async (req: Request, res: Response) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ message: "Offre d'emploi non trouvée" });
        }
        res.status(200).json({ message: "Offre mise à jour", job: updatedJob });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
};

// 📌 Supprimer une offre d'emploi
export const deleteJob = async (req: Request, res: Response) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ message: "Offre d'emploi non trouvée" });
        }
        res.status(200).json({ message: "Offre supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'offre", error });
    }
};
