import { Request, Response } from 'express';
import Candidacy from '../models/Candidacy';
import Company from '../models/Company';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getKpiData = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const company = await Company.findOne({ createdBy: req.user.id });
        if (!company) {
            return res.status(404).json({ message: "Entreprise non trouvée" });
        }

        // 📌 Candidatures par mois
        const candidaciesByMonth = await Candidacy.aggregate([
            {
                $lookup: {
                    from: "jobs",
                    localField: "jobPost",
                    foreignField: "_id",
                    as: "job"
                }
            },
            { $unwind: "$job" },
            { $match: { "job.idCompany": company._id } },
            {
                $group: {
                    _id: { $month: "$appliedAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    month: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // 📌 Candidatures par département
        const candidaciesByDepartment = await Candidacy.aggregate([
            {
                $lookup: {
                    from: "jobs",
                    localField: "jobPost",
                    foreignField: "_id",
                    as: "job"
                }
            },
            { $unwind: "$job" },
            { $match: { "job.idCompany": company._id } },
            {
                $group: {
                    _id: "$job.department",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    department: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // 📌 Statuts des candidatures
        const [pending, accepted, rejected] = await Promise.all([
            Candidacy.aggregate([
                {
                    $lookup: {
                        from: "jobs",
                        localField: "jobPost",
                        foreignField: "_id",
                        as: "job"
                    }
                },
                { $unwind: "$job" },
                { $match: { "job.idCompany": company._id, status: "pending" } },
                { $count: "count" }
            ]),
            Candidacy.aggregate([
                {
                    $lookup: {
                        from: "jobs",
                        localField: "jobPost",
                        foreignField: "_id",
                        as: "job"
                    }
                },
                { $unwind: "$job" },
                { $match: { "job.idCompany": company._id, status: "accepted" } },
                { $count: "count" }
            ]),
            Candidacy.aggregate([
                {
                    $lookup: {
                        from: "jobs",
                        localField: "jobPost",
                        foreignField: "_id",
                        as: "job"
                    }
                },
                { $unwind: "$job" },
                { $match: { "job.idCompany": company._id, status: "rejected" } },
                { $count: "count" }
            ])
        ]);

        const statusCounts = {
            pending: pending[0]?.count || 0,
            accepted: accepted[0]?.count || 0,
            rejected: rejected[0]?.count || 0
        };

        const total = statusCounts.pending + statusCounts.accepted + statusCounts.rejected;

        res.status(200).json({
            totalCandidates: total,
            shortlisted: statusCounts.accepted,
            rejected: statusCounts.rejected,
            pending: statusCounts.pending,
            candidaciesByMonth,
            candidaciesByDepartment,
            statusCounts
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des KPIs", error);
        res.status(500).json({ message: "Erreur lors de la récupération des KPIs", error });
    }
};
