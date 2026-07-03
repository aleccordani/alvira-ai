import { DocumentRepository } from "../domain/document.repository.js";

export class GetDocumentUseCase {
  constructor(private readonly repository: DocumentRepository) {}

  async execute(id: string, userId: string) {
    const document = await this.repository.findById(id);

    if (!document) {
      throw new Error("Document not found.");
    }

    if (document.userId !== userId) {
      throw new Error("Unauthorized.");
    }

    return document;
  }
}
