import { Router } from "express";

import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";
import { conversationController } from "../../../container/conversation.container.js";

const router = Router();

router.post("/", betterAuthMiddleware, conversationController.create);
router.get("/", betterAuthMiddleware, conversationController.findAll);
router.get("/:id", betterAuthMiddleware, conversationController.findOne);
router.patch("/:id", betterAuthMiddleware, conversationController.update);
router.delete("/:id", betterAuthMiddleware, conversationController.delete);

export default router;