import { prisma } from "../../../lib/prisma.js";
import { ConversationMemory } from "../domain/conversation-memory.js";
import { MemoryRepository } from "../domain/memory.repository.js";

export class PrismaMemoryRepository implements MemoryRepository {
  async findByConversationId(conversationId: string) {
    return prisma.conversationMemory.findUnique({
      where: {
        conversationId,
      },
    });
  }

  async save(memory: ConversationMemory) {
    return prisma.conversationMemory.upsert({
      where: {
        conversationId: memory.conversationId,
      },
      update: {
        summary: memory.summary,
      },
      create: memory,
    });
  }
}
