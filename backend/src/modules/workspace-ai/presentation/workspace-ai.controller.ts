import type { Response } from "express";

import type { BetterAuthRequest } from "../../../middlewares/better-auth.middleware.js";
import { askWorkspaceUseCase } from "../workspace-ai.container.js";

export class WorkspaceAIController {
  chat = async (req: BetterAuthRequest, res: Response) => {
    const userId = req.user?.userId;

    const workspaceId = typeof req.params.id === "string" ? req.params.id : "";

    const question = String(req.body?.question ?? "").trim();

    if (!userId) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Unauthorized.",
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        code: "WORKSPACE_ID_REQUIRED",
        message: "Workspace ID is required.",
      });
    }

    if (!question) {
      return res.status(400).json({
        success: false,
        code: "QUESTION_REQUIRED",
        message: "Question is required.",
      });
    }

    try {
      const answer = await askWorkspaceUseCase.execute({
        userId,
        workspaceId,
        question,
      });

      return res.json({
        success: true,
        message: "Workspace AI answered successfully.",
        data: {
          answer,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_CREDITS") {
        return res.status(402).json({
          success: false,
          code: "INSUFFICIENT_CREDITS",
          message: "Credits exhausted. Please upgrade your plan.",
        });
      }

      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          code: "USER_NOT_FOUND",
          message: "User not found.",
        });
      }

      console.error("ASK WORKSPACE ERROR:", error);

      return res.status(500).json({
        success: false,
        code: "WORKSPACE_AI_FAILED",
        message: "Failed to ask workspace.",
      });
    }
  };
}
