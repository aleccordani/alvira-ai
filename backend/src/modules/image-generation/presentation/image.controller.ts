import { Response } from "express";
import { AuthRequest } from "../../../middlewares/auth.middleware.js";
import { GenerateImageUseCase } from "../application/generate-image.usecase.js";
import { GetImageHistoryUseCase } from "../application/get-image-history.usecase.js";
import { DeleteImageUseCase } from "../application/delete-image.usecase.js";

export class ImageController {
  constructor(
    private readonly generateImageUseCase: GenerateImageUseCase,
    private readonly getImageHistoryUseCase: GetImageHistoryUseCase,
    private readonly deleteImageUseCase: DeleteImageUseCase,
  ) {}

  generate = async (req: AuthRequest, res: Response) => {
    const { prompt } = req.body;

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const image = await this.generateImageUseCase.execute({
      userId,
      prompt,
    });

    return res.json({
      image,
    });
  };

  history = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const images = await this.getImageHistoryUseCase.execute(userId);

    return res.json(images);
  };

  delete = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const imageId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!imageId || Array.isArray(imageId)) {
      return res.status(400).json({
        message: "Invalid image id",
      });
    }

    await this.deleteImageUseCase.execute(userId, imageId);

    return res.json({
      message: "Image deleted successfully",
    });
  };
}
