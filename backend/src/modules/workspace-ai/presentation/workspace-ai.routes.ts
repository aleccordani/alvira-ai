import { Router } from "express";
import { WorkspaceAIController } from "./workspace-ai.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const router = Router();
const controller = new WorkspaceAIController();

router.post(
  "/workspaces/:id/chat",
  authMiddleware,
  controller.chat.bind(controller),
);

export default router;
