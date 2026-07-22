import { Router } from "express";
import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";
import { WorkspaceAIController } from "./workspace-ai.controller.js";

const router = Router();
const controller = new WorkspaceAIController();

router.post("/workspaces/:id/chat", betterAuthMiddleware, controller.chat);

export default router;
