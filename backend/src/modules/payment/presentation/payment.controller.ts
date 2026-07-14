import type { Request, Response } from "express";

import type { BetterAuthRequest } from "../../../middlewares/better-auth.middleware.js";
import { CreateCheckoutUseCase } from "../application/create-checkout.usecase.js";
import { GetPaymentHistoryUseCase } from "../application/get-payment-history.usecase.js";
import {
  type MidtransNotification,
  PaymentWebhookUseCase,
} from "../application/payment-webhook.usecase.js";

export class PaymentController {
  constructor(
    private readonly createCheckoutUseCase: CreateCheckoutUseCase,
    private readonly getPaymentHistoryUseCase: GetPaymentHistoryUseCase,
    private readonly webhookUseCase: PaymentWebhookUseCase,
  ) {}

  checkout = async (req: BetterAuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    try {
      const checkout = await this.createCheckoutUseCase.execute(userId);

      return res.json({
        success: true,
        data: checkout,
      });
    } catch (error) {
      console.error("CREATE CHECKOUT ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create checkout.",
      });
    }
  };

  history = async (req: BetterAuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    try {
      const history = await this.getPaymentHistoryUseCase.execute(userId);

      return res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error("GET PAYMENT HISTORY ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch payment history.",
      });
    }
  };

  webhook = async (req: Request, res: Response) => {
    try {
      const result = await this.webhookUseCase.execute(
        req.body as MidtransNotification,
      );

      /*
       * Balas 200 setelah berhasil diproses.
       * Endpoint webhook memang tidak memakai login user.
       * Keasliannya divalidasi melalui signature Midtrans.
       */
      return res.status(200).json({
        success: true,
        message: "Payment notification processed",
        data: result,
      });
    } catch (error) {
      console.error("PAYMENT WEBHOOK ERROR:", error);

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to process payment notification",
      });
    }
  };

  completeMock = async (req: BetterAuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const orderId = String(req.body?.orderId ?? "");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id is required",
      });
    }

    try {
      const result = await this.webhookUseCase.executeMock(orderId, userId);

      return res.json({
        success: true,
        message: "Mock payment completed",
        data: result,
      });
    } catch (error) {
      console.error("COMPLETE MOCK PAYMENT ERROR:", error);

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to complete mock payment",
      });
    }
  };
}
