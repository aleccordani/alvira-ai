import { prisma } from "../../../lib/prisma.js";

export class GetAdminUsersUseCase {
  async execute() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        tokensUsed: true,
        storageUsed: true,
        imageUsed: true,
        workspaceUsed: true,
        createdAt: true,
        updatedAt: true,

        plan: {
          select: {
            id: true,
            name: true,
            type: true,
            monthlyCredits: true,
          },
        },

        _count: {
          select: {
            conversations: true,
            workspaces: true,
            documents: true,
            generatedImages: true,
            usageLogs: true,
            payments: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map((user) => {
      const monthlyCredits = user.plan?.monthlyCredits ?? 1_000;

      return {
        ...user,
        monthlyCredits,
        creditsUsed: user.tokensUsed,
        creditsRemaining: Math.max(monthlyCredits - user.tokensUsed, 0),
      };
    });
  }
}
