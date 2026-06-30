import { prisma } from "../../../lib/prisma.js";
import {
  CreateMessageInput,
  MessageEntity,
  MessageRepository,
} from "../domain/message.repository.js";

export class PrismaMessageRepository implements MessageRepository {
  async create(data: CreateMessageInput): Promise<MessageEntity> {
    return prisma.message.create({
      data,
    });
  }

  async findByConversationId(conversationId: string): Promise<MessageEntity[]> {
    return prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}
