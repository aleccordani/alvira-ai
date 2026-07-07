import { Router } from "express";
import { AnalyticsController } from "./analytics.controller.js";

const router = Router();
const controller = new AnalyticsController();

router.get("/stats", controller.stats.bind(controller));

export default router;
