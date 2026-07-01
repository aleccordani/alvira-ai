import { Router } from "express";
import multer from "multer";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { FileController } from "./file.controller.js";
import { PdfService } from "../infrastructure/pdf.service.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

const pdfService = new PdfService();
const controller = new FileController(pdfService);

router.post("/read", authMiddleware, upload.single("file"), controller.read);

export default router;
