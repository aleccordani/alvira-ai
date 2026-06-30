import { prisma } from "../../../lib/prisma.js";
import {
  CreateUsageLogInput,
  UsageLogEntity,
  UsageRepository,
} from "../domain/usage.repository.js";

export class PrismaUsageRepository implements UsageRepository {
  async create(data: CreateUsageLogInput): Promise<UsageLogEntity> {
    return prisma.usageLog.create({
      data: {
        userId: data.userId,
        conversationId: data.conversationId ?? null,
        model: data.model,
        promptTokens: data.promptTokens ?? 0,
        completionTokens: data.completionTokens ?? 0,
        totalTokens: data.totalTokens ?? 0,
        cost: data.cost ?? 0,
      },
    });
  }
}
