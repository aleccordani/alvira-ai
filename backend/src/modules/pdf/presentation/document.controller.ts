import { Request, Response } from "express";
import { UploadDocumentUseCase } from "../application/upload-document.usecase.js";

export class DocumentController {
  constructor(private readonly uploadDocumentUseCase: UploadDocumentUseCase) {}

  upload = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded.",
        });
      }

      const userId = (req as any).user.id ?? (req as any).user.userId;

      const document = await this.uploadDocumentUseCase.execute({
        userId,
        name: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
      });

      return res.status(201).json(document);
    } catch (error) {
      console.error("========== PDF ERROR ==========");
      console.error(error);

      if (error instanceof Error) {
        console.error(error.message);
      }

      return res.status(500).json({
        success: false,
        message: "Failed to upload document.",
      });
    }
  };
}
