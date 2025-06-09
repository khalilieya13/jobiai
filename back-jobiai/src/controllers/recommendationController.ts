import { Request, Response } from "express";
import mongoose from "mongoose";
import Resume from "../models/Resume";
import Job from "../models/Job";
import { AuthRequest } from "../middlewares/authMiddleware";
import axios from "axios";

/**
 * Get recommended jobs for the logged-in candidate
 * @route GET /api/recommendations/jobs
 * @access Private (Candidate)
 */
export const getRecommendedJobsForCandidate = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.user.role !== "candidate") {
            return res.status(403).json({ message: "Access denied. Candidates only." });
        }

        const userId = req.user.id;

        // Get candidate's resume
        const resume = await Resume.findOne({ createdBy: userId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        if (!resume.recommendations || !resume.recommendations.jobs || resume.recommendations.jobs.length === 0) {
            return res.status(200).json([]);
        }

        // Get the job IDs from recommendations
        const jobIds = resume.recommendations.jobs.map(job => job.jobId);

        // Fetch the job details with company information
        const recommendedJobs = await Job.find({
            _id: { $in: jobIds },
            status: "Active" // Only return active jobs
        }).populate("idCompany", "name logo industry location");

        // Add the matching score to each job
        const jobsWithScores = recommendedJobs.map(job => {
            const recommendation = resume.recommendations?.jobs.find(
                rec => rec.jobId.toString() === (job._id as mongoose.Types.ObjectId).toString()
            );

            return {
                ...job.toObject(),
                matchingScore: recommendation?.score || 0
            };
        });

        // Sort by matching score (highest first)
        jobsWithScores.sort((a, b) => b.matchingScore - a.matchingScore);

        return res.status(200).json(jobsWithScores);
    } catch (error) {
        console.error("Error in getRecommendedJobsForCandidate:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get recommended resumes for a specific job
 * @route GET /api/recommendations/resumes/:jobId
 * @access Private (Recruiter)
 */
export const getRecommendedResumesForJob = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.user.role !== "recruiter" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Recruiters and admins only." });
        }

        const { jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }

        // Verify the recruiter has access to this job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }


        if (!job.recommendations || !job.recommendations.resumes || job.recommendations.resumes.length === 0) {
            return res.status(200).json([]);
        }

        // Get the resume IDs from recommendations
        const resumeIds = job.recommendations.resumes.map(resume => resume.resumeId);

        // Fetch the resume details
        const recommendedResumes = await Resume.find({
            _id: { $in: resumeIds }
        }).select("-recommendations"); // Don't include the recommendations field

        // Add the matching score to each resume
        const resumesWithScores = recommendedResumes.map(resume => {
            const recommendation = job.recommendations?.resumes.find(
                rec => rec.resumeId.toString() === (resume._id as mongoose.Types.ObjectId).toString()
            );

            return {
                ...resume.toObject(),
                matchingScore: recommendation?.score || 0
            };
        });

        // Sort by matching score (highest first)
        resumesWithScores.sort((a, b) => b.matchingScore - a.matchingScore);

        return res.status(200).json(resumesWithScores);
    } catch (error) {
        console.error("Error in getRecommendedResumesForJob:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get all recommended resumes for all jobs belonging to the recruiter's company
 * @route GET /api/recommendations/company/resumes
 * @access Private (Recruiter)
 */
export const getRecommendedResumesForCompany = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.user.role !== "recruiter" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Recruiters and admins only." });
        }

        // Récupérer la compagnie via l'API existante
        const response = await axios.get("http://localhost:5000/jobiai/api/company", {
            headers: {
                Authorization: req.headers.authorization || ""
            }
        });

        const company = response.data;
        const companyId = company._id;

        if (!companyId) {
            return res.status(400).json({ message: "Company ID not found in response" });
        }

        // Récupérer tous les jobs de la compagnie
        const jobs = await Job.find({ idCompany: companyId });

        const results = [];

        for (const job of jobs) {
            const recommendations = job.recommendations?.resumes || [];

            if (recommendations.length === 0) continue;

            // Prendre la meilleure recommandation
            const topRecommendation = recommendations.reduce((best, current) => {
                return (current.score || 0) > (best.score || 0) ? current : best;
            });

            // Récupérer le CV complet sauf `recommendations`
            const topResume = await Resume.findById(topRecommendation.resumeId).select("-recommendations");

            if (!topResume) continue;

            results.push({
                resume: {
                    id: topResume._id,
                    ...topResume.toObject()
                },
                job: {
                    id: job._id,
                    jobTitle: job.jobTitle,
                    department: job.department,
                    location: job.location
                },
                matchingScore: topRecommendation.score
            });
        }

        return res.status(200).json(results);

    } catch (error) {
        console.error("Error in getRecommendedResumesForCompany:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get matching score between a specific resume and job
 * @route GET /api/recommendations/match/:resumeId/:jobId
 * @access Private
 */
export const getMatchingScore = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { jobId } = req.params;
        const response = await axios.get("http://localhost:5000/jobiai/api/resume/", {
            headers: {
                Authorization: req.headers.authorization || ""
            }
        });

        const resumeId = response.data._id;



        if (!mongoose.Types.ObjectId.isValid(resumeId) || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid IDs provided" });
        }

        // Find the resume
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Find the job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if there's a matching score in the resume recommendations
        let matchingScore = 0;

        if (resume.recommendations?.jobs) {
            const jobRecommendation = resume.recommendations.jobs.find(
                rec => rec.jobId.toString() === jobId
            );

            if (jobRecommendation) {
                matchingScore = jobRecommendation.score;
            }
        }

        return res.status(200).json({ matchingScore });
    } catch (error) {
        console.error("Error in getMatchingScore:", error);
        return res.status(500).json({ message: "Server error" });
    }
};