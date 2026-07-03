import { PdfParserService } from "../infrastructure/pdf-parser.service.js";
import { DocumentRepository } from "../domain/document.repository.js";

export class ExtractDocumentUseCase {
  constructor(
    private readonly parser: PdfParserService,
    private readonly repository: DocumentRepository,
  ) {}

  async execute(id: string, path: string) {
    const text = await this.parser.extractText(path);

    await this.repository.updateExtractedText(id, text);

    return text;
  }
}
