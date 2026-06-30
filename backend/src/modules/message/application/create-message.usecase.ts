import { MessageRepository } from "../domain/message.repository.js";

type CreateMessageInput = {
  conversationId: string;
  content: string;
};

export class CreateMessageUseCase {
  constructor(private readonly repository: MessageRepository) {}

  async execute(data: CreateMessageInput) {
    return this.repository.create({
      conversationId: data.conversationId,
      role: "user",
      content: data.content,
    });
  }
}
