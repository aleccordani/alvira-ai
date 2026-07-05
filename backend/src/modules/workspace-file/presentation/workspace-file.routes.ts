import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { workspaceFileController } from "../../../container/workspace-file.container.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/:id/files",
  authMiddleware,
  upload.single("file"),
  workspaceFileController.upload,
);

router.delete(
  "/:id/files/:fileId",
  authMiddleware,
  workspaceFileController.remove,
);

router.get("/:id/files", authMiddleware, workspaceFileController.list);

export default router;
