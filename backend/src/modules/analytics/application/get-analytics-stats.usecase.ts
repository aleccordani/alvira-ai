import { prisma } from "../../../lib/prisma.js";

export class GetAnalyticsStatsUseCase {
  async execute(userId: string) {
    const usageLogs = await prisma.usageLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const totalTokens = usageLogs.reduce(
      (total, log) => total + log.totalTokens,
      0,
    );

    const totalRequests = usageLogs.length;

    const totalCost = usageLogs.reduce((total, log) => total + log.cost, 0);

    return {
      totalTokens,
      totalRequests,
      totalCost,
      recentUsage: usageLogs.map((log) => ({
        id: log.id,
        model: log.model,
        totalTokens: log.totalTokens,
        cost: log.cost,
        createdAt: log.createdAt,
      })),
    };
  }
}
