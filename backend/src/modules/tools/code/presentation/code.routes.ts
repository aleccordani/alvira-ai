import { Router } from "express";

import { authMiddleware } from "../../../../middlewares/auth.middleware.js";
import { codeController } from "../../../../container/code.container.js";

const router = Router();

router.post("/explain", authMiddleware, codeController.explain);
router.post("/explain/stream", authMiddleware, codeController.explainStream);

export default router;