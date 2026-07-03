import { DocumentRepository } from "../domain/document.repository.js";
import { AIService } from "../../ai/application/ai.service.js";

export class SummarizeDocumentUseCase {
  constructor(
    private readonly repository: DocumentRepository,
    private readonly aiService: AIService,
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

    const response = await this.aiService.generate({
      system:
        "You are Alvira PDF Intelligence. Summarize documents clearly and professionally.",

      prompt: `Summarize this document clearly:

${extractedText.slice(0, 12000)}`,
    });

    const summary = response.content;

    await this.repository.updateSummary(id, summary);

    return {
      documentId: id,
      summary,
    };
  }
}
