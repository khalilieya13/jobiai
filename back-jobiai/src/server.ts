import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import companyRoutes from "./routes/companyRoutes";
import jobRoutes from "./routes/jobRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import resumeRoutes from "./routes/resumeRoutes";
import candidacyRoutes from "./routes/candidacyRoutes";
import quizRoutes from "./routes/quizRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ⚠️ Crée un serveur HTTP

// Crée une instance Socket.IO et configure le CORS
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"], // ton frontend
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(cors());
app.use(express.json());

app.use("/jobiai/api/", authRoutes);
app.use("/jobiai/api/company", companyRoutes);
app.use("/jobiai/api/job", jobRoutes);
app.use("/jobiai/api/candidate", candidateRoutes);
app.use("/jobiai/api/resume", resumeRoutes);
app.use("/jobiai/api/candidacy", candidacyRoutes);
app.use("/jobiai/api/quiz", quizRoutes);
app.use("/jobiai/api/dashboard", dashboardRoutes);
app.use("/jobiai/api/notification", notificationRoutes);
app.use("/jobiai/api/recommendation", recommendationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Stockage des sockets connectés : userId -> socketId
const connectedUsers = new Map<string, string>();

// Socket.IO logic
io.on("connection", (socket) => {
    console.log("✅ Un utilisateur est connecté :", socket.id);

    socket.on("register", (userId: string) => {
        connectedUsers.set(userId, socket.id);
        console.log(`🧾 Utilisateur ${userId} enregistré avec le socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
        for (let [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                break;
            }
        }
        console.log("❌ Utilisateur déconnecté :", socket.id);
    });
});

// Export des objets utiles aux contrôleurs
export { io, connectedUsers };




// Lancement du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur avec Socket.IO lancé sur http://localhost:${PORT}`);
});