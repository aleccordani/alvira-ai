import { DocumentRepository } from "../domain/document.repository.js";

export class RenameDocumentUseCase {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(id: string, userId: string, name: string) {
    const document = await this.documentRepository.findById(id);

    if (!document || document.userId !== userId) {
      throw new Error("Document not found.");
    }

    if (!name.trim()) {
      throw new Error("Document name is required.");
    }

    return this.documentRepository.update({
      ...document,
      name: name.trim(),
    });
  }
}
