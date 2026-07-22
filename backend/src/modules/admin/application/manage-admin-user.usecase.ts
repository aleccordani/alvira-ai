import { PlanType, UserStatus } from "@prisma/client";

import { prisma } from "../../../lib/prisma.js";

export type ManageAdminUserAction =
  | "SET_PLAN"
  | "RESET_CREDITS"
  | "SUSPEND"
  | "ACTIVATE";

export type ManageAdminUserInput = {
  targetUserId: string;
  actorUserId: string;
  action: ManageAdminUserAction;
  planType?: PlanType;
};

export class ManageAdminUserUseCase {
  async execute(input: ManageAdminUserInput) {
    if (!input.targetUserId) {
      throw new Error("TARGET_USER_ID_REQUIRED");
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: input.targetUserId,
      },
      select: {
        id: true,
        role: true,
        status: true,
        planId: true,
      },
    });

    if (!targetUser) {
      throw new Error("USER_NOT_FOUND");
    }

    if (
      input.targetUserId === input.actorUserId &&
      input.action === "SUSPEND"
    ) {
      throw new Error("CANNOT_SUSPEND_SELF");
    }

    switch (input.action) {
      case "SET_PLAN": {
        if (!input.planType) {
          throw new Error("PLAN_TYPE_REQUIRED");
        }

        const plan = await prisma.plan.findUnique({
          where: {
            type: input.planType,
          },
          select: {
            id: true,
            name: true,
            type: true,
            monthlyCredits: true,
          },
        });

        if (!plan) {
          throw new Error("PLAN_NOT_FOUND");
        }

        const updatedUser = await prisma.user.update({
          where: {
            id: input.targetUserId,
          },
          data: {
            planId: plan.id,
            tokensUsed: 0,
            imageUsed: 0,
            workspaceUsed: 0,
            storageUsed: 0,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            tokensUsed: true,
            plan: {
              select: {
                id: true,
                name: true,
                type: true,
                monthlyCredits: true,
              },
            },
          },
        });

        return {
          action: input.action,
          user: updatedUser,
        };
      }

      case "RESET_CREDITS": {
        const updatedUser = await prisma.user.update({
          where: {
            id: input.targetUserId,
          },
          data: {
            tokensUsed: 0,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            tokensUsed: true,
            plan: {
              select: {
                id: true,
                name: true,
                type: true,
                monthlyCredits: true,
              },
            },
          },
        });

        return {
          action: input.action,
          user: updatedUser,
        };
      }

      case "SUSPEND": {
        const updatedUser = await prisma.user.update({
          where: {
            id: input.targetUserId,
          },
          data: {
            status: UserStatus.SUSPENDED,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        });

        return {
          action: input.action,
          user: updatedUser,
        };
      }

      case "ACTIVATE": {
        const updatedUser = await prisma.user.update({
          where: {
            id: input.targetUserId,
          },
          data: {
            status: UserStatus.ACTIVE,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        });

        return {
          action: input.action,
          user: updatedUser,
        };
      }

      default:
        throw new Error("INVALID_ADMIN_ACTION");
    }
  }
}
