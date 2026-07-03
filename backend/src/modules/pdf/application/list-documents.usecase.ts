import { DocumentRepository } from "../domain/document.repository.js";

export class ListDocumentsUseCase {
  constructor(private readonly repository: DocumentRepository) {}

  async execute(userId: string) {
    return this.repository.findByUserId(userId);
  }
}
