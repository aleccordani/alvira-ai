import { Request, Response } from "express";
import { ExplainCodeUseCase } from "../application/explain-code.usecase.js";
import { explainCodeSchema } from "./code.validation.js";
import { successResponse } from "../../../../shared/utils/response.js";

export class CodeController {
  constructor(private readonly explainCodeUseCase: ExplainCodeUseCase) {}

  explain = async (req: Request, res: Response) => {
    const body = explainCodeSchema.parse(req.body);

    const result = await this.explainCodeUseCase.execute({
      language: body.language,
      code: body.code,
    });

    return successResponse(res, "Code explained successfully.", result);
  };
}
