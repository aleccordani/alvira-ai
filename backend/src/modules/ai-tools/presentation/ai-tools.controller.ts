import type { Response } from "express";

import type { BetterAuthRequest } from "../../../middlewares/better-auth.middleware.js";
import { RunAiToolUseCase } from "../application/run-ai-tool.usecase.js";
import type { AiToolType } from "../types/ai-tool.type.js";

export class AiToolsController {
  constructor(private readonly runAiTool: RunAiToolUseCase) {}

  run = async (req: BetterAuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const tool = req.body?.tool as AiToolType | undefined;
    const input = String(req.body?.input ?? "").trim();

    if (!userId) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Unauthorized.",
      });
    }

    if (!tool || !input) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Tool and input are required.",
      });
    }

    try {
      const result = await this.runAiTool.execute(userId, {
        tool,
        input,
      });

      return res.json({
        success: true,
        data: result,
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

      console.error("RUN AI TOOL ERROR:", error);

      return res.status(500).json({
        success: false,
        code: "AI_TOOL_FAILED",
        message: "Failed to run AI tool.",
      });
    }
  };
}
