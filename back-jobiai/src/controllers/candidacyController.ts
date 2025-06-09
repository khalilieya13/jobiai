import { Request, Response } from "express";
import { io, connectedUsers } from "../server";
import Job from "../models/Job";
import User from "../models/User";
import Notification from "../models/Notification";
import Candidacy from "../models/Candidacy";
import { AuthRequest } from "../middlewares/authMiddleware";
import mongoose from "mongoose";

interface PopulatedJob {
    _id: mongoose.Types.ObjectId;
    jobTitle: string;
    idCompany?: {
        createdBy: {
            _id: mongoose.Types.ObjectId;
        };
    };
}

interface PopulatedCandidate {
    _id: mongoose.Types.ObjectId;
}

interface PopulatedCandidacy {
    candidate: PopulatedCandidate;
    jobPost: PopulatedJob;
}

const createAndSendNotification = async (
    userId: string,
    message: string,
    link: string,
    notificationType: string
) => {
    try {
        await Notification.create({
            userId,
            message,
            read: false,
            link,
            timestamp: new Date(),
        });

        const socketId = connectedUsers.get(userId);
        if (socketId) {
            io.to(socketId).emit("new-notification", {
                message,
                link,
                type: notificationType,
                date: new Date(),
            });
        }
    } catch (error) {
        console.error("Error creating/sending notification:", error);
    }
};

export const applyToJob = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { jobPost } = req.body;

        if (!jobPost) {
            return res.status(400).json({ message: "Job post ID is required" });
        }

        const existingCandidacy = await Candidacy.findOne({
            jobPost,
            candidate: req.user.id
        });

        if (existingCandidacy) {
            return res.status(400).json({ message: "You have already applied to this job" });
        }

        const newCandidacy = new Candidacy({
            jobPost,
            candidate: req.user.id,
            status: "pending",
            appliedAt: new Date()
        });

        await newCandidacy.save();

         const job = await Job.findById(jobPost)
            .populate({
                path: 'idCompany',
                populate: {
                    path: 'createdBy',
                    model: User,
                    select: '_id'
                },
            })
            .lean<PopulatedJob>()
            .exec();

        if (job?.idCompany?.createdBy?._id) {
            const recruiterId = job.idCompany.createdBy._id.toString();
            const jobTitle = job.jobTitle;

            const notificationMessage = `A candidate has applied to your job posting "${jobTitle}".`;
            const notificationLink = `/company/candidate/list/${job._id}`;

            await createAndSendNotification(
                recruiterId,
                notificationMessage,
                notificationLink,
                "candidacy"
            );
        }

        res.status(201).json({
            message: "Application submitted successfully",
            candidacy: newCandidacy
        });
    } catch (error) {
        console.error("Server error in applyToJob:", error);
        res.status(500).json({ message: "Error submitting application", error });
    }
};

export const getCandidaciesByCandidate = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const candidacies = await Candidacy.find({ candidate: req.user.id })
            .populate("jobPost")
            .lean()
            .exec();
        res.status(200).json(candidacies);
    } catch (error) {
        console.error("Error retrieving applications:", error);
        res.status(500).json({ message: "Error retrieving applications", error: error instanceof Error ? error.message : error });
    }

};

export const getCandidaciesByJobPost = async (req: Request, res: Response) => {
    try {
        const { jobPostId } = req.params;

        const candidacies = await Candidacy.find({ jobPost: jobPostId })
            .lean()
            .exec();
        res.status(200).json(candidacies);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving applications", error });
    }
};

export const updateCandidacyStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updatedCandidacy = await Candidacy.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate("candidate", "_id")
            .populate("jobPost", "jobTitle")
            .lean<PopulatedCandidacy>()
            .exec();

        if (!updatedCandidacy) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (updatedCandidacy.candidate._id && updatedCandidacy.jobPost.jobTitle) {
            const candidateId = updatedCandidacy.candidate._id.toString();
            const jobTitle = updatedCandidacy.jobPost.jobTitle;

            let statusText = "";
            switch (status) {
                case "accepted":
                    statusText = "accepted";
                    break;
                case "rejected":
                    statusText = "rejected";
                    break;
                default:
                    statusText = "updated";
            }

            const notificationMessage = `Your application for "${jobTitle}" has been ${statusText}.`;
            const notificationLink = '/candidate/dashboard';

            await createAndSendNotification(
                candidateId,
                notificationMessage,
                notificationLink,
                "candidacy-update"
            );
        }

        res.status(200).json({
            message: "Status updated successfully",
            candidacy: updatedCandidacy
        });
    } catch (error) {
        console.error("Server error in updateCandidacyStatus:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteCandidacy = async (req: Request, res: Response) => {
    try {
        const deletedCandidacy = await Candidacy.findByIdAndDelete(req.params.id);
        if (!deletedCandidacy) {
            return res.status(404).json({ message: "Application not found" });
        }
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting application", error });
    }
};

export const getCandidacyCounts = async (req: Request, res: Response) => {
    try {
        const totalCandidacies = await Candidacy.countDocuments();
        const acceptedCandidacies = await Candidacy.countDocuments({ status: "accepted" });

        res.status(200).json({
            totalCandidacies,
            acceptedCandidacies
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving application counts", error });
    }
};