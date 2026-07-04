import { aiService } from "./ai.container.js";

import { ExplainCodeUseCase } from "../modules/tools/code/application/explain-code.usecase.js";
import { ExplainCodeStreamUseCase } from "../modules/tools/code/application/explain-code-stream.usecase.js";
import { CodeController } from "../modules/tools/code/presentation/code.controller.js";

const explainCodeUseCase = new ExplainCodeUseCase(aiService);
const explainCodeStreamUseCase = new ExplainCodeStreamUseCase(aiService);

export const codeController = new CodeController(
  explainCodeUseCase,
  explainCodeStreamUseCase,
);
