import { ConversationRepository } from "../domain/conversation.repository.js";

type CreateConversationInput = {
  title: string;
  userId: string;
};

export class CreateConversationUseCase {
  constructor(private readonly repository: ConversationRepository) {}

  async execute(data: CreateConversationInput) {
    return this.repository.create(data);
  }
}
