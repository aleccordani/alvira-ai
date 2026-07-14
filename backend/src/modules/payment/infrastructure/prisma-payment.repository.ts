import type { PlanType } from "@prisma/client";

import { prisma } from "../../../lib/prisma.js";
import type {
  CreatePendingPaymentInput,
  PaymentPlan,
  PaymentRepository,
  PaymentUser,
  PendingPayment,
} from "../domain/payment.repository.js";

export class PrismaPaymentRepository implements PaymentRepository {
  async findUserById(userId: string): Promise<PaymentUser | null> {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async findPlanByType(type: PlanType): Promise<PaymentPlan | null> {
    return prisma.plan.findUnique({
      where: {
        type,
      },
      select: {
        id: true,
        name: true,
        type: true,
        price: true,
      },
    });
  }

  async createPending(
    data: CreatePendingPaymentInput,
  ): Promise<PendingPayment> {
    return prisma.payment.create({
      data: {
        userId: data.userId,
        planId: data.planId,
        amount: data.amount,
        provider: data.provider,
        transactionId: data.transactionId,
        status: "PENDING",
      },
      select: {
        id: true,
        transactionId: true,
        amount: true,
      },
    });
  }
}
