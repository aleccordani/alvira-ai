import { Request, Response } from "express";
import { PdfService } from "../infrastructure/pdf.service.js";
import { MessageRepository } from "../../message/domain/message.repository.js";

export class FileController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly messageRepository: MessageRepository,
  ) {}

  read = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const conversationId = req.body.conversationId;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation id is required",
      });
    }

    const text = await this.pdfService.extractText(req.file.path);

    const limitedText = text.slice(0, 12000);

    const documentMessage = await this.messageRepository.create({
      conversationId,
      role: "system",
      content: `User uploaded a PDF document. Use this document as context when answering future questions.\n\nPDF content:\n${limitedText}`,
    });

    return res.json({
      success: true,
      message: "PDF text extracted and saved to conversation",
      data: {
        text: limitedText,
        message: documentMessage,
      },
    });
  };
}
