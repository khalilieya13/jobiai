import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// 📌 Inscription
export const signup = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Utilisateur déjà existant" });
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: IUser = new User({ email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Identifiants incorrects" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "mot de passe  incorrects" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};