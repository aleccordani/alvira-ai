import { Router } from "express";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { chatController } from "../../../container/chat.container.js";

const router = Router();

router.post("/", authMiddleware, chatController.send);
router.post("/stream", authMiddleware, chatController.stream);

export default router;
