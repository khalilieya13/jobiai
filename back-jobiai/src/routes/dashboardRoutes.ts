// Dans votre fichier de routes backend, par exemple routes/dashboard.ts
import { Router } from 'express';
import { getKpiData } from '../controllers/dashboardController';
import { auth } from "../middlewares/authMiddleware";

const router = Router();

// Vérifiez que la route est bien définie
// @ts-ignore
router.get("/company/kpi",auth, getKpiData);

export default router;
