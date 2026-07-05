import { Request, Response } from "express";
import { successResponse } from "../../../shared/utils/response.js";
import { CreateWorkspaceFileUseCase } from "../application/create-workspace-file.usecase.js";
import { GetWorkspaceFilesUseCase } from "../application/get-workspace-files.usecase.js";
import { PdfParserService } from "../../pdf/infrastructure/pdf-parser.service.js";
import { ingestWorkspaceFileUseCase } from "../../workspace-ai/workspace-ai.container.js";
import { DeleteWorkspaceFileUseCase } from "../application/delete-workspace-file.usecase.js";

export class WorkspaceFileController {
  constructor(
    private readonly createWorkspaceFileUseCase: CreateWorkspaceFileUseCase,
    private readonly getWorkspaceFilesUseCase: GetWorkspaceFilesUseCase,
    private readonly deleteWorkspaceFileUseCase: DeleteWorkspaceFileUseCase,
  ) {}

  upload = async (req: Request, res: Response) => {
    const workspaceId = req.params.id;

    if (!workspaceId || Array.isArray(workspaceId)) {
      throw new Error("Workspace id is required.");
    }

    if (!req.file) {
      throw new Error("File is required.");
    }

    const uploadedFile = req.file;

    const file = await this.createWorkspaceFileUseCase.execute({
      workspaceId,
      filename: uploadedFile.originalname,
      path: uploadedFile.path,
      mimeType: uploadedFile.mimetype,
      size: uploadedFile.size,
    });

    // if (uploadedFile.mimetype === "application/pdf") {
    //   const pdfParser = new PdfParserService();
    //   const text = await pdfParser.extractText(uploadedFile.path);

    //   await ingestWorkspaceFileUseCase.execute({
    //     workspaceId,
    //     workspaceFileId: file.id,
    //     text,
    //   });
    // }

    return successResponse(
      res,
      "Workspace file uploaded and indexed successfully.",
      file,
    );
  };

  list = async (req: Request, res: Response) => {
    const workspaceId = req.params.id;

    if (!workspaceId || Array.isArray(workspaceId)) {
      throw new Error("Workspace id is required.");
    }

    const files = await this.getWorkspaceFilesUseCase.execute(workspaceId);

    return successResponse(res, "Workspace files fetched successfully.", files);
  };

  remove = async (req: Request, res: Response) => {
    const workspaceId = typeof req.params.id === "string" ? req.params.id : "";
    const fileId =
      typeof req.params.fileId === "string" ? req.params.fileId : "";

    if (!workspaceId || !fileId) {
      return res.status(400).json({
        success: false,
        message: "Workspace id and file id are required.",
      });
    }

    await this.deleteWorkspaceFileUseCase.execute(workspaceId, fileId);

    return successResponse(res, "Workspace file deleted successfully.", null);
  };
}
