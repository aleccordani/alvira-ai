import { Request, Response } from "express";
import { RunAiToolUseCase } from "../application/run-ai-tool.usecase.js";

export class AiToolsController {
  constructor(private readonly runAiTool: RunAiToolUseCase) {}

  run = async (req: Request, res: Response) => {
    const { tool, input } = req.body;

    const result = await this.runAiTool.execute({
      tool,
      input,
    });

    return res.json(result);
  };
}
