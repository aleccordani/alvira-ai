import { ConversationRepository } from "../domain/conversation.repository.js";

export class DeleteConversationUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  async execute(id: string) {
    return this.repository.delete(id);
  }
}
