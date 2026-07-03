import { Request, Response } from "express";
import { UploadDocumentUseCase } from "../application/upload-document.usecase.js";
import { ListDocumentsUseCase } from "../application/list-documents.usecase.js";
import { GetDocumentUseCase } from "../application/get-document.usecase.js";
import { DeleteDocumentUseCase } from "../application/delete-document.usecase.js";
import { SummarizeDocumentUseCase } from "../application/summarize-document.usecase.js";

export class DocumentController {
  constructor(
    private readonly uploadDocumentUseCase: UploadDocumentUseCase,
    private readonly listDocumentsUseCase: ListDocumentsUseCase,
    private readonly getDocumentUseCase: GetDocumentUseCase,
    private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
    private readonly summarizeDocumentUseCase: SummarizeDocumentUseCase,
  ) {}
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

  list = async (req: Request, res: Response) => {
    const userId = (req as any).user.id ?? (req as any).user.userId;

    const documents = await this.listDocumentsUseCase.execute(userId);

    return res.json(documents);
  };

  get = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id ?? (req as any).user.userId;

      const document = await this.getDocumentUseCase.execute(
        req.params.id as string,
        userId,
      );

      return res.json(document);
    } catch (error) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id ?? (req as any).user.userId;

      await this.deleteDocumentUseCase.execute(req.params.id as string, userId);

      return res.json({
        success: true,
      });
    } catch {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }
  };

  summarize = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id ?? (req as any).user.userId;

      const result = await this.summarizeDocumentUseCase.execute(
        req.params.id as string,
        userId,
      );

      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to summarize document.",
      });
    }
  };
}
