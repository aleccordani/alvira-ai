import { Router } from "express";

import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";
import { CheckCreditsUseCase } from "../../usage/application/check-credits.usecase.js";
import { CreateUsageLogUseCase } from "../../usage/application/create-usage-log.usecase.js";
import { PrismaUsageRepository } from "../../usage/infrastructure/prisma-usage.repository.js";

import { DeleteImageUseCase } from "../application/delete-image.usecase.js";
import { GenerateImageUseCase } from "../application/generate-image.usecase.js";
import { GetImageHistoryUseCase } from "../application/get-image-history.usecase.js";

import { MockImageService } from "../infrastructure/mock-image.service.js";
import { OpenAIImageService } from "../infrastructure/openai-image.service.js";
import { PrismaImageRepository } from "../infrastructure/prisma-image.repository.js";
import { ImageController } from "./image.controller.js";

const router = Router();

const openAIProvider = new OpenAIImageService();
const mockProvider = new MockImageService();

const imageRepository = new PrismaImageRepository();
const usageRepository = new PrismaUsageRepository();

const checkCreditsUseCase = new CheckCreditsUseCase(usageRepository);

const createUsageLogUseCase = new CreateUsageLogUseCase(usageRepository);

const imageProvider = {
  async generate(prompt: string) {
    try {
      return await openAIProvider.generate(prompt);
    } catch (error) {
      console.error("OpenAI image failed, using fallback:", error);

      return mockProvider.generate(prompt);
    }
  },
};

const generateImageUseCase = new GenerateImageUseCase(
  imageProvider,
  imageRepository,
  checkCreditsUseCase,
  createUsageLogUseCase,
);

const getImageHistoryUseCase = new GetImageHistoryUseCase(imageRepository);

const deleteImageUseCase = new DeleteImageUseCase(imageRepository);

const controller = new ImageController(
  generateImageUseCase,
  getImageHistoryUseCase,
  deleteImageUseCase,
);

router.post("/generate", betterAuthMiddleware, controller.generate);

router.get("/history", betterAuthMiddleware, controller.history);

router.delete("/:id", betterAuthMiddleware, controller.delete);

export default router;
