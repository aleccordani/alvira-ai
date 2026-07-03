import { Router } from "express";
import multer from "multer";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";

import { PrismaDocumentRepository } from "../infrastructure/prisma-document.repository.js";
import { UploadDocumentUseCase } from "../application/upload-document.usecase.js";
import { DocumentController } from "./document.controller.js";
import { ListDocumentsUseCase } from "../application/list-documents.usecase.js";
import { GetDocumentUseCase } from "../application/get-document.usecase.js";
import { DeleteDocumentUseCase } from "../application/delete-document.usecase.js";
import { PdfParserService } from "../infrastructure/pdf-parser.service.js";
import { ExtractDocumentUseCase } from "../application/extract-document.usecase.js";
import { OpenAIService } from "../../chat/infrastructure/openai.service.js";
import { SummarizeDocumentUseCase } from "../application/summarize-document.usecase.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

const repository = new PrismaDocumentRepository();
const parser = new PdfParserService();

const extractDocumentUseCase = new ExtractDocumentUseCase(parser, repository);

const uploadDocumentUseCase = new UploadDocumentUseCase(
  repository,
  extractDocumentUseCase,
);

const openAIService = new OpenAIService();

const summarizeDocumentUseCase = new SummarizeDocumentUseCase(
  repository,
  openAIService,
);

const listDocumentsUseCase = new ListDocumentsUseCase(repository);
const getDocumentUseCase = new GetDocumentUseCase(repository);
const deleteDocumentUseCase = new DeleteDocumentUseCase(repository);

const controller = new DocumentController(
  uploadDocumentUseCase,
  listDocumentsUseCase,
  getDocumentUseCase,
  deleteDocumentUseCase,
  summarizeDocumentUseCase,
);

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  controller.upload,
);

router.get("/", authMiddleware, controller.list);
router.get("/:id", authMiddleware, controller.get);
router.delete("/:id", authMiddleware, controller.remove);
router.post("/:id/summarize", authMiddleware, controller.summarize);

export default router;
