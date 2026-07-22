import { PlanType } from "@prisma/client";

import { prisma } from "../../../lib/prisma.js";
import type {
  CreateUsageLogInput,
  CreditBalance,
  UsageLogEntity,
  UsageRepository,
} from "../domain/usage.repository.js";

export class PrismaUsageRepository implements UsageRepository {
  async getCreditBalance(userId: string): Promise<CreditBalance> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        tokensUsed: true,
        plan: {
          select: {
            monthlyCredits: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    let monthlyCredits = user.plan?.monthlyCredits;

    if (monthlyCredits === undefined) {
      const freePlan = await prisma.plan.findUnique({
        where: {
          type: PlanType.FREE,
        },
        select: {
          monthlyCredits: true,
        },
      });

      monthlyCredits = freePlan?.monthlyCredits ?? 1_000;
    }

    const creditsUsed = Math.max(user.tokensUsed, 0);
    const creditsRemaining = Math.max(monthlyCredits - creditsUsed, 0);

    return {
      monthlyCredits,
      creditsUsed,
      creditsRemaining,
    };
  }

  async create(data: CreateUsageLogInput): Promise<UsageLogEntity> {
    const creditsToConsume = Math.max(
      0,
      data.creditsToConsume ?? data.totalTokens ?? 0,
    );

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: data.userId,
        },
        select: {
          id: true,
          tokensUsed: true,
          plan: {
            select: {
              monthlyCredits: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      let monthlyCredits = user.plan?.monthlyCredits;

      if (monthlyCredits === undefined) {
        const freePlan = await tx.plan.findUnique({
          where: {
            type: PlanType.FREE,
          },
          select: {
            monthlyCredits: true,
          },
        });

        monthlyCredits = freePlan?.monthlyCredits ?? 1_000;
      }

      const creditsRemaining = Math.max(monthlyCredits - user.tokensUsed, 0);

      if (creditsToConsume > creditsRemaining) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      if (creditsToConsume > 0) {
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            tokensUsed: {
              increment: creditsToConsume,
            },
          },
        });
      }

      return tx.usageLog.create({
        data: {
          userId: data.userId,
          conversationId: data.conversationId ?? null,
          model: data.model,
          promptTokens: data.promptTokens ?? 0,
          completionTokens: data.completionTokens ?? 0,
          totalTokens: data.totalTokens ?? creditsToConsume,
          cost: data.cost ?? 0,
        },
      });
    });
  }
}
