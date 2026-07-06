import { Router } from "express";

import { RunAiToolUseCase } from "../application/run-ai-tool.usecase.js";
import { MockAiToolsService } from "../infrastructure/mock-ai-tools.service.js";
import { AiToolsController } from "./ai-tools.controller.js";
import { createAiToolsProvider } from "../infrastructure/ai-tools-provider.factory.js";

const router = Router();

const aiToolsService = createAiToolsProvider();
const runAiToolUseCase = new RunAiToolUseCase(aiToolsService);
const controller = new AiToolsController(runAiToolUseCase);

router.post("/run", controller.run);

export default router;
