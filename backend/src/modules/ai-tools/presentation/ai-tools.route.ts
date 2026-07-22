import { Router } from "express";

import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";
import { CheckCreditsUseCase } from "../../usage/application/check-credits.usecase.js";
import { CreateUsageLogUseCase } from "../../usage/application/create-usage-log.usecase.js";
import { PrismaUsageRepository } from "../../usage/infrastructure/prisma-usage.repository.js";
import { RunAiToolUseCase } from "../application/run-ai-tool.usecase.js";
import { createAiToolsProvider } from "../infrastructure/ai-tools-provider.factory.js";
import { AiToolsController } from "./ai-tools.controller.js";

const router = Router();

const aiToolsService = createAiToolsProvider();

const usageRepository = new PrismaUsageRepository();

const checkCreditsUseCase = new CheckCreditsUseCase(usageRepository);

const createUsageLogUseCase = new CreateUsageLogUseCase(usageRepository);

const runAiToolUseCase = new RunAiToolUseCase(
  aiToolsService,
  checkCreditsUseCase,
  createUsageLogUseCase,
);

const controller = new AiToolsController(runAiToolUseCase);

router.post("/run", betterAuthMiddleware, controller.run);

export default router;
