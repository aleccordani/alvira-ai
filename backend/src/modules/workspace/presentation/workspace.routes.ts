import { Router } from "express";

import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";
import { workspaceController } from "../../../container/workspace.container.js";

const router = Router();

router.get("/", betterAuthMiddleware, workspaceController.list);
router.post("/", betterAuthMiddleware, workspaceController.create);
router.patch("/:id", betterAuthMiddleware, workspaceController.update);
router.delete("/:id", betterAuthMiddleware, workspaceController.delete);

export default router;