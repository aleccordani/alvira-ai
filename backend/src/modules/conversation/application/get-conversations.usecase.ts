import { ConversationRepository } from "../domain/conversation.repository.js";

export class GetConversationsUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  async execute(userId: string) {
    return this.repository.findByUserId(userId);
  }
}
