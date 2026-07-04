import { Request, Response } from "express";
import { ExplainCodeUseCase } from "../application/explain-code.usecase.js";
import { ExplainCodeStreamUseCase } from "../application/explain-code-stream.usecase.js";
import { explainCodeSchema } from "./code.validation.js";
import { successResponse } from "../../../../shared/utils/response.js";

export class CodeController {
  constructor(
    private readonly explainCodeUseCase: ExplainCodeUseCase,
    private readonly explainCodeStreamUseCase: ExplainCodeStreamUseCase,
  ) {}

  explain = async (req: Request, res: Response) => {
    const body = explainCodeSchema.parse(req.body);

    const result = await this.explainCodeUseCase.execute({
      language: body.language,
      code: body.code,
    });

    return successResponse(res, "Code explained successfully.", result);
  };

  explainStream = async (req: Request, res: Response) => {
    const body = explainCodeSchema.parse(req.body);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    await this.explainCodeStreamUseCase.execute({
      language: body.language,
      code: body.code,
      onChunk: (chunk: string) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      },
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  };
}
