import { ConversationRepository } from "../domain/conversation.repository.js";

export class GetConversationUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  async execute(id: string) {
    const conversation = await this.repository.findWithMessages(id);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return conversation;
  }
}
