import express from "express";
import {
    getRecommendedJobsForCandidate,
    getRecommendedResumesForJob,
    getRecommendedResumesForCompany,
    getMatchingScore
} from "../controllers/recommendationController";
import { auth } from "../middlewares/authMiddleware";

const router = express.Router();

// Routes for recommendations
// @ts-ignore
router.get("/jobs", auth, getRecommendedJobsForCandidate);
// @ts-ignore
router.get("/resumes/:jobId", auth, getRecommendedResumesForJob);
// @ts-ignore
router.get("/company/resumes", auth, getRecommendedResumesForCompany);
// @ts-ignore
router.get("/match/:jobId", auth, getMatchingScore);

export default router;