import { prisma } from "../../../lib/prisma.js";

export class GetAdminDashboardUseCase {
  async execute() {
    const [users, payments, subscriptions, usageLogs] = await Promise.all([
      prisma.user.count(),

      prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
        },

        _sum: {
          amount: true,
        },
      }),

      prisma.subscription.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.usageLog.count(),
    ]);

    return {
      users,
      activeSubscriptions: subscriptions,
      totalRevenue: payments._sum.amount ?? 0,
      totalRequests: usageLogs,
    };
  }
}
