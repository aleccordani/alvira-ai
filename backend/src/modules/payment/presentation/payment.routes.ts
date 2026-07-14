import { Router } from "express";

import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";
import { paymentController } from "../../../container/payment.container.js";

const router = Router();

router.post("/checkout", betterAuthMiddleware, paymentController.checkout);
router.get("/history", betterAuthMiddleware, paymentController.history);
router.post("/webhook", paymentController.webhook);
router.post(
  "/mock/complete",
  betterAuthMiddleware,
  paymentController.completeMock,
);

export default router;
