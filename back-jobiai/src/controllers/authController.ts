import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sgMail from "../config/sendgridConfig";

const JWT_SECRET = process.env.JWT_SECRET as string;

// 📌 Inscription
export const signup = async (req: Request, res: Response) => {
    const { email, password, role, username } = req.body; // 👈 ajouter username

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: IUser = new User({
            email,
            password: hashedPassword,
            role,
            username // 👈 ici aussi
        });
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(201).json({
            message: "User created successfully",
            token,
            role: newUser.role
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


// 📌 Connexion
export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
// 📌 Mettre à jour le nom et l'email de l'utilisateur connecté
// 📌 Mettre à jour le nom et l'email de l'utilisateur connecté
export const updateProfile = async (req: Request, res: Response) => {
    const { username, email } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        // Build update object based on provided fields
        const updateData: Partial<IUser> = {};
        if (username) updateData.username = username;
        if (email) {
            // Check if email is already in use by another user
            const existingUser = await User.findOne({ email, _id: { $ne: decoded.id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use by another account' });
            }
            updateData.email = email;
        }

        // Only update if there's something to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            decoded.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error });
    }
};


// 📌 Récupérer le profil de l'utilisateur
export const getProfile = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await User.findById(decoded.id).select('-password'); // Exclude password field
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
// 📌 Retourner tous les utilisateurs (réservé à l'admin)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error });
    }
};


// 📌 Modifier le mot de passe
export const changePassword = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { newPassword } = req.body;

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating password', error: err });
    }
};

// 📌 Supprimer le compte de l'utilisateur
export const deleteAccount = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        await User.findByIdAndDelete(decoded.id);
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting account', error: err });
    }
};
// 📌 Supprimer un compte en tant qu'admin
export const deleteUserByAdmin = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        const userIdToDelete = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userIdToDelete);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted by admin successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
};



// En mémoire : mapping email -> code
const resetCodes = new Map<string, string>();

export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Générer un code aléatoire à 6 chiffres
        const code = crypto.randomInt(100000, 999999).toString();
        resetCodes.set(email, code);

        // ✅ Envoi de l’email via SendGrid
        const msg = {
            to: email,
            from: 'eya.elkhalili@polytechnicien.tn', // doit être vérifié dans ton compte SendGrid
            subject: 'Réinitialisation du mot de passe',
            text: `Votre code de réinitialisation est : ${code}`,
            html: `<p>Votre code de réinitialisation est : <strong>${code}</strong></p>`,
        };

        await sgMail.send(msg);

        res.json({ message: "Verification code sent to email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyResetCode = async (req: Request, res: Response) => {
    const { email, code } = req.body;

    const validCode = resetCodes.get(email);
    if (!validCode || validCode !== code) {
        return res.status(400).json({ message: "Invalid code" });
    }

    res.json({ message: "Code verified" });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, code, newPassword } = req.body;

    const validCode = resetCodes.get(email);
    if (!validCode || validCode !== code) {
        return res.status(400).json({ message: "Invalid or expired code" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        // Supprimer le code après usage
        resetCodes.delete(email);

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};