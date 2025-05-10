import express from "express";
import {signup, signin, getProfile} from "../controllers/authController";
import { auth, isAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

// @ts-ignore
router.post("/signup", signup);
// @ts-ignore
router.post("/signin", signin);
// @ts-ignore
router.get("/admin", auth, isAdmin, (req, res) => res.json({ message: "Bienvenue Admin" }));

// @ts-ignore
router.get('/profile', getProfile);
export default router;