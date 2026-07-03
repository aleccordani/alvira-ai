import { Router } from "express";
import multer from "multer";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";

import { PrismaDocumentRepository } from "../infrastructure/prisma-document.repository.js";
import { UploadDocumentUseCase } from "../application/upload-document.usecase.js";
import { DocumentController } from "./document.controller.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

const repository = new PrismaDocumentRepository();

const uploadDocumentUseCase = new UploadDocumentUseCase(repository);

const controller = new DocumentController(uploadDocumentUseCase);

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  controller.upload,
);

export default router;
