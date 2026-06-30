export type MessageRole = "user" | "assistant" | "system";

export type MessageEntity = {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: Date;
};

export type CreateMessageInput = {
  conversationId: string;
  role: MessageRole;
  content: string;
};

export interface MessageRepository {
  create(data: CreateMessageInput): Promise<MessageEntity>;
  findByConversationId(conversationId: string): Promise<MessageEntity[]>;
}
