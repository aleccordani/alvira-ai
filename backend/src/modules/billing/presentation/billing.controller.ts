import type { Response } from "express";

import type { BetterAuthRequest } from "../../../middlewares/better-auth.middleware.js";
import { GetMyBillingUseCase } from "../application/get-my-billing.usecase.js";

export class BillingController {
  constructor(private readonly getMyBillingUseCase: GetMyBillingUseCase) {}

  getMe = async (req: BetterAuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    try {
      const billing = await this.getMyBillingUseCase.execute(userId);

      return res.json({
        success: true,
        data: billing,
      });
    } catch (error) {
      console.error("GET BILLING ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch billing data",
      });
    }
  };
}
