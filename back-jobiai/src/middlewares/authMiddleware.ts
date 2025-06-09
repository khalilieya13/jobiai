import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

// 📌 Vérifier le token JWT
export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Accès refusé" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET) as { id: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide" });
    }
};
// 📌 Vérifier le rôle d'admin
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "admin") return res.status(403).json({ message: "Accès interdit" });
    next();
};
// 📌 Vérifier le rôle candidate
export const isCandidate = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "candidate") return res.status(403).json({ message: "Accès interdit" });
    next();
};
// 📌 Vérifier le rôle recruiter
export const isRecruiter = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "recruiter") return res.status(403).json({ message: "Accès interdit" });
    next();
};
