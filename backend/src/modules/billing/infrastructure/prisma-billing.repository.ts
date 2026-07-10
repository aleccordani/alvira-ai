import { prisma } from "../../../lib/prisma.js";
import type {
  BillingRepository,
  UserBillingData,
} from "../domain/billing.repository.js";

export class PrismaBillingRepository implements BillingRepository {
  async findUserBilling(userId: string): Promise<UserBillingData | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        tokensUsed: true,
        plan: {
          select: {
            id: true,
            name: true,
            type: true,
            monthlyCredits: true,
          },
        },
        subscriptions: {
          where: {
            status: "ACTIVE",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            status: true,
            startedAt: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      plan: user.plan,
      subscription: user.subscriptions[0] ?? null,
      tokensUsed: user.tokensUsed,
    };
  }
}
