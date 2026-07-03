import { MemoryRepository } from "../domain/memory.repository.js";

export class MemoryService {
  constructor(private readonly repository: MemoryRepository) {}

  async getSummary(conversationId: string) {
    const memory = await this.repository.findByConversationId(conversationId);

    return memory?.summary ?? "";
  }

  async saveSummary(conversationId: string, summary: string) {
    return this.repository.save({
      conversationId,
      summary,
      updatedAt: new Date(),
    });
  }
}
