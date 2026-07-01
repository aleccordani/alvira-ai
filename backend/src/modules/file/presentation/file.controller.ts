import { Request, Response } from "express";
import { PdfService } from "../infrastructure/pdf.service.js";

export class FileController {
  constructor(private readonly pdfService: PdfService) {}

  read = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const text = await this.pdfService.extractText(req.file.path);

    return res.json({
      success: true,
      text,
    });
  };
}
