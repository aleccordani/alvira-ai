import { ConversationMemory } from "./conversation-memory.js";

export interface MemoryRepository {
  findByConversationId(
    conversationId: string,
  ): Promise<ConversationMemory | null>;

  save(
    memory: ConversationMemory,
  ): Promise<ConversationMemory>;
}