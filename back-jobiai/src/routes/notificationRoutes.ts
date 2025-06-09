import express from "express";
import {
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
} from "../controllers/notificationController";
import { auth } from "../middlewares/authMiddleware";

const router = express.Router();

// @ts-ignore
router.get("/my", auth, getUserNotifications);
// @ts-ignore
router.patch("/:id/read", auth, markNotificationAsRead);
// @ts-ignore
router.delete("/:id", auth, deleteNotification);

export default router;
