import { Router } from "express";
import multer from "multer";

import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";
import { workspaceFileController } from "../../../container/workspace-file.container.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/:id/files",
  betterAuthMiddleware,
  upload.single("file"),
  workspaceFileController.upload,
);

router.delete(
  "/:id/files/:fileId",
  betterAuthMiddleware,
  workspaceFileController.remove,
);

router.get("/:id/files", betterAuthMiddleware, workspaceFileController.list);

export default router;