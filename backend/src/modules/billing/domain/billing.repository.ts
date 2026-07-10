import type { PlanType, SubscriptionStatus } from "@prisma/client";

export type UserBillingData = {
  plan: {
    id: string;
    name: string;
    type: PlanType;
    monthlyCredits: number;
  } | null;

  subscription: {
    status: SubscriptionStatus;
    startedAt: Date;
    expiresAt: Date | null;
  } | null;

  tokensUsed: number;
};

export interface BillingRepository {
  findUserBilling(userId: string): Promise<UserBillingData | null>;
}
