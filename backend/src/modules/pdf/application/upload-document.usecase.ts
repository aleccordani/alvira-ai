import { DocumentRepository } from "../domain/document.repository.js";
import { ExtractDocumentUseCase } from "./extract-document.usecase.js";

type UploadDocumentInput = {
  userId: string;
  name: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
};

export class UploadDocumentUseCase {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly extractDocumentUseCase: ExtractDocumentUseCase,
  ) {}

  async execute(data: UploadDocumentInput) {
    const document = await this.documentRepository.create({
      userId: data.userId,
      name: data.name,
      originalName: data.originalName,
      path: data.path,
      mimeType: data.mimeType,
      size: data.size,
      extractedText: null,
      summary: null,
    });

    await this.extractDocumentUseCase.execute(document.id, document.path);

    return document;
  }
}
