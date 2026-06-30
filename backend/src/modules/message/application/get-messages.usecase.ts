import { MessageRepository } from "../domain/message.repository.js";

export class GetMessagesUseCase {
  constructor(private readonly repository: MessageRepository) {}

  async execute(conversationId: string) {
    return this.repository.findByConversationId(conversationId);
  }
}
