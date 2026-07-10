import type { BillingRepository } from "../domain/billing.repository.js";
import { PermissionService } from "./permission.service.js";

export class GetMyBillingUseCase {
  constructor(
    private readonly billingRepository: BillingRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async execute(userId: string) {
    const billing = await this.billingRepository.findUserBilling(userId);

    if (!billing) {
      throw new Error("User billing data not found");
    }

    const planType = billing.plan?.type ?? "FREE";
    const permissions = this.permissionService.get(planType);

    const monthlyCredits =
      billing.plan?.monthlyCredits ?? permissions.monthlyCredits;

    const creditsUsed = billing.tokensUsed;
    const creditsRemaining = Math.max(monthlyCredits - creditsUsed, 0);

    return {
      plan: billing.plan
        ? {
            id: billing.plan.id,
            name: billing.plan.name,
            type: billing.plan.type,
          }
        : {
            id: null,
            name: "Free",
            type: "FREE",
          },

      monthlyCredits,
      creditsUsed,
      creditsRemaining,
      subscriptionStatus: billing.subscription?.status ?? "ACTIVE",
      startedAt: billing.subscription?.startedAt ?? null,
      expiresAt: billing.subscription?.expiresAt ?? null,
      permissions,
    };
  }
}
