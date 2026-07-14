import { randomUUID } from "node:crypto";

import { PlanType } from "@prisma/client";

import type { PaymentGateway } from "../domain/payment-gateway.js";
import type { PaymentRepository } from "../domain/payment.repository.js";

export class CreateCheckoutUseCase {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly gateway: PaymentGateway,
  ) {}

  async execute(userId: string) {
    const user = await this.repository.findUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const plan = await this.repository.findPlanByType(PlanType.PRO);

    if (!plan) {
      throw new Error("Pro plan not found");
    }

    const orderId = `ALVIRA-${randomUUID()}`;

    await this.repository.createPending({
      userId,
      planId: plan.id,
      amount: plan.price,
      provider: "MIDTRANS",
      transactionId: orderId,
    });

    return this.gateway.createCheckout({
      orderId,
      amount: plan.price,
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  }
}
