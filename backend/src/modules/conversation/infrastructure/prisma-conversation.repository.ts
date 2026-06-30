import { prisma } from "../../../lib/prisma.js";
import {
  ConversationEntity,
  ConversationRepository,
  ConversationWithMessagesEntity,
  CreateConversationInput,
  UpdateConversationInput,
} from "../domain/conversation.repository.js";

export class PrismaConversationRepository implements ConversationRepository {
  async create(data: CreateConversationInput): Promise<ConversationEntity> {
    return prisma.conversation.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<ConversationEntity[]> {
    return prisma.conversation.findMany({
      where: { userId },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<ConversationEntity | null> {
    return prisma.conversation.findUnique({
      where: { id },
    });
  }

  async findWithMessages(
    id: string,
  ): Promise<ConversationWithMessagesEntity | null> {
    return prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  async update(data: UpdateConversationInput): Promise<ConversationEntity> {
    return prisma.conversation.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
      },
    });
  }

  async delete(id: string): Promise<ConversationEntity> {
    return prisma.conversation.delete({
      where: { id },
    });
  }
}
