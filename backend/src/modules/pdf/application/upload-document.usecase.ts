import { DocumentRepository } from "../domain/document.repository.js";

type UploadDocumentInput = {
  userId: string;
  name: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
};

export class UploadDocumentUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(data: UploadDocumentInput) {
    return this.documentRepository.create({
      ...data,
      extractedText: null,
      summary: null,
    });
  }
}
