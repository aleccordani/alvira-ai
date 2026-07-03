import { aiService } from "./ai.container.js";

import { ExplainCodeUseCase } from "../modules/tools/code/application/explain-code.usecase.js";
import { CodeController } from "../modules/tools/code/presentation/code.controller.js";

const explainCodeUseCase = new ExplainCodeUseCase(aiService);

export const codeController = new CodeController(explainCodeUseCase);
