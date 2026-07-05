import { Request, Response } from "express";
import { askWorkspaceUseCase } from "../workspace-ai.container.js";

export class WorkspaceAIController {
  async chat(req: Request, res: Response) {
    try {
      const workspaceId =
        typeof req.params.id === "string" ? req.params.id : "";
      const { question } = req.body;

      if (!workspaceId) {
        return res.status(400).json({
          message: "Workspace ID is required.",
        });
      }

      if (!question) {
        return res.status(400).json({
          message: "Question is required.",
        });
      }

      const answer = await askWorkspaceUseCase.execute({
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
      console.error(error);

      return res.status(500).json({
        message: "Failed to ask workspace.",
      });
    }
  }
}
