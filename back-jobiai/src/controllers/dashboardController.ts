import { Request, Response } from 'express';
import Candidacy from '../models/Candidacy';
import Company from '../models/Company';
import { AuthRequest } from '../middlewares/authMiddleware'; // Middleware d'auth

// 📌 Récupérer les KPIs de l'entreprise (total, mois, département, statut)
export const getKpiData = async (req: AuthRequest, res: Response) => {
    try {
        console.log("KPI controller reached");

        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const company = await Company.findOne({ createdBy: req.user.id });

        if (!company) {
            console.log("Entreprise non trouvée pour l'utilisateur", req.user.id);
            return res.status(404).json({ message: "Entreprise non trouvée" });
        }

        // Récupérer les candidatures par mois
        const candidaciesByMonth = await Candidacy.aggregate([
            { $match: { company: company._id } },
            {
                $group: {
                    _id: { $month: "$appliedAt" }, // Agréger par mois
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    month: "$_id", // Utiliser la valeur du mois
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // Récupérer les candidatures par département
        const candidaciesByDepartment = await Candidacy.aggregate([
            { $match: { company: company._id } },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'jobPost',
                    foreignField: '_id',
                    as: 'job'
                }
            },
            { $unwind: '$job' },
            {
                $group: {
                    _id: '$job.department', // Grouper par département
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    department: '$_id', // Utiliser le département
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // Récupérer les candidatures par statut
        const candidaciesByStatus = await Promise.all([
            Candidacy.countDocuments({ company: company._id, status: 'pending' }),
            Candidacy.countDocuments({ company: company._id, status: 'accepted' }),
            Candidacy.countDocuments({ company: company._id, status: 'rejected' }),
        ]);

        // Organiser toutes les données KPI
        const kpiData = {
            total: candidaciesByMonth.reduce((sum, item) => sum + item.count, 0), // Total des candidatures
            candidaciesByMonth,
            candidaciesByDepartment,
            statusCounts: {
                pending: candidaciesByStatus[0],
                accepted: candidaciesByStatus[1],
                rejected: candidaciesByStatus[2],
            }
        };

        console.log("KPI Data:", kpiData);
        res.status(200).json(kpiData);
    } catch (error) {
        console.error("Erreur lors de la récupération des KPIs", error);
        res.status(500).json({ message: "Erreur lors de la récupération des KPIs", error });
    }
};
