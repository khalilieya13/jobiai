import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import companyRoutes from "./routes/companyRoutes";
import jobRoutes from "./routes/jobRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import resumeRoutes from "./routes/resumeRoutes";
import candidacyRoutes from "./routes/candidacyRoutes";
import quizRoutes from "./routes/quizRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";


dotenv.config();
connectDB();

const app = express();
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





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur TypeScript en ligne sur http://localhost:${PORT}`);
});
