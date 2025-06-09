import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Notification from "../models/Notification";

// 📌 Récupérer toutes les notifications de l'utilisateur connecté
export const getUserNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📌 Marquer une notification comme lue
export const markNotificationAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const updatedNotification = await Notification.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: "Notification non trouvée" });
        }

        res.status(200).json({ message: "Notification marquée comme lue", notification: updatedNotification });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la notification :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📌 Supprimer une notification
export const deleteNotification = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await Notification.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Notification non trouvée" });
        }

        res.status(200).json({ message: "Notification supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de la notification :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
