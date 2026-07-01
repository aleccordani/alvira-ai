import { Router } from "express";
import multer from "multer";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { FileController } from "./file.controller.js";
import { PdfService } from "../infrastructure/pdf.service.js";
import { PrismaMessageRepository } from "../../message/infrastructure/prisma-message.repository.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

const pdfService = new PdfService();
const messageRepository = new PrismaMessageRepository();

const controller = new FileController(pdfService, messageRepository);

router.post("/read", authMiddleware, upload.single("file"), controller.read);

export default router;
