import { Router } from "express";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { workspaceController } from "../../../container/workspace.container.js";

const router = Router();

router.get("/", authMiddleware, workspaceController.list);
router.post("/", authMiddleware, workspaceController.create);
router.patch("/:id", authMiddleware, workspaceController.update);
router.delete("/:id", authMiddleware, workspaceController.delete);

export default router;