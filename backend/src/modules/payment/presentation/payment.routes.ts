import { Router } from "express";

import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";
import { paymentController } from "../../../container/payment.container.js";

const router = Router();

router.post("/checkout", betterAuthMiddleware, paymentController.checkout);

export default router;