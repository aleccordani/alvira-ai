import type { Response } from "express";

import type { BetterAuthRequest } from "../../../middlewares/better-auth.middleware.js";
import { DeleteImageUseCase } from "../application/delete-image.usecase.js";
import { GenerateImageUseCase } from "../application/generate-image.usecase.js";
import { GetImageHistoryUseCase } from "../application/get-image-history.usecase.js";

export class ImageController {
  constructor(
    private readonly generateImageUseCase: GenerateImageUseCase,
    private readonly getImageHistoryUseCase: GetImageHistoryUseCase,
    private readonly deleteImageUseCase: DeleteImageUseCase,
  ) {}

  generate = async (req: BetterAuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const prompt = String(req.body?.prompt ?? "").trim();

    if (!userId) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Unauthorized.",
      });
    }

    if (!prompt) {
      return res.status(400).json({
        success: false,
        code: "PROMPT_REQUIRED",
        message: "Prompt is required.",
      });
    }

    try {
      const image = await this.generateImageUseCase.execute({
        userId,
        prompt,
      });

      return res.json({
        success: true,
        data: {
          image,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message === "INSUFFICIENT_CREDITS") {
        return res.status(402).json({
          success: false,
          code: "INSUFFICIENT_CREDITS",
          message: "You need at least 300 credits to generate an image.",
        });
      }

      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          code: "USER_NOT_FOUND",
          message: "User not found.",
        });
      }

      console.error("GENERATE IMAGE ERROR:", error);

      return res.status(500).json({
        success: false,
        code: "IMAGE_GENERATION_FAILED",
        message: "Failed to generate image.",
      });
    }
  };

  history = async (req: BetterAuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Unauthorized.",
      });
    }

    try {
      const images = await this.getImageHistoryUseCase.execute(userId);

      return res.json({
        success: true,
        data: images,
      });
    } catch (error) {
      console.error("GET IMAGE HISTORY ERROR:", error);

      return res.status(500).json({
        success: false,
        code: "IMAGE_HISTORY_FAILED",
        message: "Failed to load image history.",
      });
    }
  };

  delete = async (req: BetterAuthRequest, res: Response) => {
    const userId = req.user?.userId;

    const imageId = typeof req.params.id === "string" ? req.params.id : "";

    if (!userId) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Unauthorized.",
      });
    }

    if (!imageId) {
      return res.status(400).json({
        success: false,
        code: "INVALID_IMAGE_ID",
        message: "Invalid image id.",
      });
    }

    try {
      await this.deleteImageUseCase.execute(userId, imageId);

      return res.json({
        success: true,
        message: "Image deleted successfully.",
      });
    } catch (error) {
      console.error("DELETE IMAGE ERROR:", error);

      return res.status(500).json({
        success: false,
        code: "IMAGE_DELETE_FAILED",
        message: "Failed to delete image.",
      });
    }
  };
}
