import { PlanType } from "@prisma/client";
import type { Permission } from "../domain/permission.js";

export class PermissionService {
  get(plan: PlanType): Permission {
    switch (plan) {
      case "FREE":
        return {
          canChat: true,
          canGenerateImage: false,
          canWorkspace: true,
          canMemory: false,
          canAnalytics: false,
          canVision: false,
          monthlyCredits: 1000,
        };

      case "PRO":
        return {
          canChat: true,
          canGenerateImage: true,
          canWorkspace: true,
          canMemory: true,
          canAnalytics: true,
          canVision: true,
          monthlyCredits: 1_500_000,
        };

      case "BUSINESS":
        return {
          canChat: true,
          canGenerateImage: true,
          canWorkspace: true,
          canMemory: true,
          canAnalytics: true,
          canVision: true,
          monthlyCredits: 5_000_000,
        };

      default:
        throw new Error(`Unsupported plan: ${plan}`);
    }
  }
}