import type { Response } from "express";

import type { BetterAuthRequest } from "../../../middlewares/better-auth.middleware.js";
import { CreateCheckoutUseCase } from "../application/create-checkout.usecase.js";

export class PaymentController {
  constructor(private readonly createCheckoutUseCase: CreateCheckoutUseCase) {}

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
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to create checkout.",
      });
    }
  };
}
