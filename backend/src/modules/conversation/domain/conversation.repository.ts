import { MessageEntity } from "../../message/domain/message.repository.js";

export type ConversationEntity = {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ConversationWithMessagesEntity = ConversationEntity & {
  messages: MessageEntity[];
};

export type CreateConversationInput = {
  title: string;
  userId: string;
};

export type UpdateConversationInput = {
  id: string;
  title: string;
};

export interface ConversationRepository {
  create(data: CreateConversationInput): Promise<ConversationEntity>;
  findByUserId(userId: string): Promise<ConversationEntity[]>;
  findById(id: string): Promise<ConversationEntity | null>;
  findWithMessages(id: string): Promise<ConversationWithMessagesEntity | null>;
  update(data: UpdateConversationInput): Promise<ConversationEntity>;
  delete(id: string): Promise<ConversationEntity>;
}
