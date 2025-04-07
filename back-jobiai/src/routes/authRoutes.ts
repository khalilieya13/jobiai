import express from "express";
import { signup, signin } from "../controllers/authController";
import { auth, isAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

// @ts-ignore
router.post("/signup", signup);
// @ts-ignore
router.post("/signin", signin);
// @ts-ignore
router.get("/admin", auth, isAdmin, (req, res) => res.json({ message: "Bienvenue Admin" }));

export default router;