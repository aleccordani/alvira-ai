import { ConversationRepository } from "../domain/conversation.repository.js";

type UpdateConversationInput = {
  id: string;
  title: string;
};

export class UpdateConversationUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  async execute(data: UpdateConversationInput) {
    return this.repository.update(data);
  }
}
