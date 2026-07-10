import { Router } from "express";

import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";
import { billingController } from "../../../container/billing.container.js";

const router = Router();

router.get("/me", betterAuthMiddleware, billingController.getMe);

export default router;