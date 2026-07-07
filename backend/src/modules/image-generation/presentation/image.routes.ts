import { Router } from "express";
import { GenerateImageUseCase } from "../application/generate-image.usecase.js";
import { OpenAIImageService } from "../infrastructure/openai-image.service.js";
import { MockImageService } from "../infrastructure/mock-image.service.js";
import { PrismaImageRepository } from "../infrastructure/prisma-image.repository.js";
import { ImageController } from "./image.controller.js";
import { GetImageHistoryUseCase } from "../application/get-image-history.usecase.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { DeleteImageUseCase } from "../application/delete-image.usecase.js";

const router = Router();

const openAIProvider = new OpenAIImageService();
const mockProvider = new MockImageService();
const imageRepository = new PrismaImageRepository();
const getImageHistoryUseCase = new GetImageHistoryUseCase(imageRepository);

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
);
const deleteImageUseCase = new DeleteImageUseCase(imageRepository);

const controller = new ImageController(
  generateImageUseCase,
  getImageHistoryUseCase,
    deleteImageUseCase,
);

router.post("/generate", authMiddleware, controller.generate);
router.get("/history", authMiddleware, controller.history);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
