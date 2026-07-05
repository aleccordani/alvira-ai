import { Router } from "express";
import multer from "multer";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { documentController } from "../../../container/document.container.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  documentController.upload,
);

router.get("/", authMiddleware, documentController.list);
router.patch("/:id", authMiddleware, documentController.rename);
router.get("/:id", authMiddleware, documentController.get);
router.delete("/:id", authMiddleware, documentController.remove);
router.post("/:id/summarize", authMiddleware, documentController.summarize);


export default router;