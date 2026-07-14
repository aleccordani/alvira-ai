import { createHash, timingSafeEqual } from "node:crypto";

import { PaymentStatus, SubscriptionStatus } from "@prisma/client";

import { prisma } from "../../../lib/prisma.js";

export type MidtransNotification = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_time?: string;
};

export type PaymentWebhookResult = {
  orderId: string;
  paymentStatus: PaymentStatus;
  upgraded: boolean;
  ignored?: boolean;
};

export class PaymentWebhookUseCase {
  async execute(
    notification: MidtransNotification,
  ): Promise<PaymentWebhookResult> {
    this.validateRequiredFields(notification);
    this.verifySignature(notification);

    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: notification.order_id,
      },
      include: {
        plan: true,
      },
    });

    if (!payment) {
      throw new Error("Payment transaction not found");
    }

    if (!payment.plan) {
      throw new Error("Payment plan not found");
    }
    const plan = payment.plan;

    const notifiedAmount = Number(notification.gross_amount);

    if (!Number.isFinite(notifiedAmount) || notifiedAmount !== payment.amount) {
      throw new Error("Payment amount mismatch");
    }

    const mappedStatus = this.mapStatus(notification);

    if (!mappedStatus) {
      return {
        orderId: notification.order_id,
        paymentStatus: payment.status,
        upgraded: false,
        ignored: true,
      };
    }

    /*
     * Webhook Midtrans bisa dikirim lebih dari sekali.
     * Jika sudah sukses, jangan membuat subscription baru lagi.
     */
    if (payment.status === PaymentStatus.SUCCESS) {
      return {
        orderId: notification.order_id,
        paymentStatus: PaymentStatus.SUCCESS,
        upgraded: false,
      };
    }

    if (mappedStatus !== PaymentStatus.SUCCESS) {
      const updatedPayment = await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: mappedStatus,
        },
      });

      return {
        orderId: notification.order_id,
        paymentStatus: updatedPayment.status,
        upgraded: false,
      };
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: PaymentStatus.SUCCESS,
          paidAt: startedAt,
        },
      });

      const existingSubscription = await tx.subscription.findFirst({
        where: {
          paymentId: payment.id,
        },
      });

      if (!existingSubscription) {
        /*
         * Tutup subscription aktif sebelumnya agar satu user
         * tidak mempunyai beberapa subscription aktif.
         */
        await tx.subscription.updateMany({
          where: {
            userId: payment.userId,
            status: SubscriptionStatus.ACTIVE,
          },
          data: {
            status: SubscriptionStatus.EXPIRED,
          },
        });

        await tx.subscription.create({
          data: {
            userId: payment.userId,
            planId: plan.id,
            status: SubscriptionStatus.ACTIVE,
            startedAt,
            expiresAt,
            provider: payment.provider,
            paymentId: payment.id,
          },
        });
      }

      await tx.user.update({
        where: {
          id: payment.userId,
        },
        data: {
          planId: plan.id,
          tokensUsed: 0,
          imageUsed: 0,
          workspaceUsed: 0,
          storageUsed: 0,
        },
      });
    });

    return {
      orderId: notification.order_id,
      paymentStatus: PaymentStatus.SUCCESS,
      upgraded: true,
    };
  }

  async executeMock(orderId: string, userId: string) {
    if (process.env.PAYMENT_MOCK !== "true") {
      throw new Error("Mock payment is disabled");
    }

    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: orderId,
        userId,
      },
    });

    if (!payment) {
      throw new Error("Mock payment not found");
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY is not configured");
    }

    const statusCode = "200";
    const grossAmount = payment.amount.toFixed(2);

    const signatureKey = createHash("sha512")
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest("hex");

    return this.execute({
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: "settlement",
      fraud_status: "accept",
      payment_type: "mock",
      transaction_time: new Date().toISOString(),
    });
  }

  private validateRequiredFields(notification: MidtransNotification) {
    if (
      !notification.order_id ||
      !notification.status_code ||
      !notification.gross_amount ||
      !notification.signature_key ||
      !notification.transaction_status
    ) {
      throw new Error("Invalid Midtrans notification payload");
    }
  }

  private verifySignature(notification: MidtransNotification) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY is not configured");
    }

    const rawSignature =
      notification.order_id +
      notification.status_code +
      notification.gross_amount +
      serverKey;

    const expectedSignature = createHash("sha512")
      .update(rawSignature)
      .digest("hex");

    const receivedBuffer = Buffer.from(notification.signature_key, "utf8");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      throw new Error("Invalid Midtrans signature");
    }
  }

  private mapStatus(notification: MidtransNotification): PaymentStatus | null {
    const transactionStatus = notification.transaction_status.toLowerCase();

    if (transactionStatus === "settlement") {
      return PaymentStatus.SUCCESS;
    }

    if (
      transactionStatus === "capture" &&
      notification.fraud_status?.toLowerCase() === "accept"
    ) {
      return PaymentStatus.SUCCESS;
    }

    if (transactionStatus === "pending") {
      return PaymentStatus.PENDING;
    }

    if (transactionStatus === "expire") {
      return PaymentStatus.EXPIRED;
    }

    if (
      transactionStatus === "deny" ||
      transactionStatus === "cancel" ||
      transactionStatus === "failure"
    ) {
      return PaymentStatus.FAILED;
    }

    return null;
  }
}
