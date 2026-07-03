import { DocumentRepository } from "../domain/document.repository.js";
import { OpenAIService } from "../../chat/infrastructure/openai.service.js";

export class SummarizeDocumentUseCase {
  constructor(
    private readonly repository: DocumentRepository,
    private readonly openAIService: OpenAIService,
  ) {}

  async execute(id: string, userId: string) {
    const document = await this.repository.findById(id);

    if (!document) {
      throw new Error("Document not found.");
    }

    if (document.userId !== userId) {
      throw new Error("Unauthorized.");
    }

    const extractedText = document.extractedText?.trim();

    if (!extractedText) {
      throw new Error("Document text is empty.");
    }

    const summary = await this.openAIService.generateReply([
      {
        role: "system",
        content:
          "You are Alvira PDF Intelligence. Summarize documents clearly and professionally.",
      },
      {
        role: "user",
        content: `Summarize this document clearly:\n\n${extractedText.slice(
          0,
          12000,
        )}`,
      },
    ]);

    await this.repository.updateSummary(id, summary);

    return {
      documentId: id,
      summary,
    };
  }
}
