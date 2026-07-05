import { PrismaDocumentRepository } from "../modules/pdf/infrastructure/prisma-document.repository.js";

import { UploadDocumentUseCase } from "../modules/pdf/application/upload-document.usecase.js";
import { ExtractDocumentUseCase } from "../modules/pdf/application/extract-document.usecase.js";
import { ListDocumentsUseCase } from "../modules/pdf/application/list-documents.usecase.js";
import { GetDocumentUseCase } from "../modules/pdf/application/get-document.usecase.js";
import { DeleteDocumentUseCase } from "../modules/pdf/application/delete-document.usecase.js";
import { SummarizeDocumentUseCase } from "../modules/pdf/application/summarize-document.usecase.js";
import { PdfParserService } from "../modules/pdf/infrastructure/pdf-parser.service.js";
import { DocumentController } from "../modules/pdf/presentation/document.controller.js";
import { RenameDocumentUseCase } from "../modules/pdf/application/rename-document.usecase.js";

import { aiService } from "./ai.container.js";

const repository = new PrismaDocumentRepository();
const parser = new PdfParserService();

const extractDocumentUseCase = new ExtractDocumentUseCase(parser, repository);

const uploadDocumentUseCase = new UploadDocumentUseCase(
  repository,
  extractDocumentUseCase,
);

const summarizeDocumentUseCase = new SummarizeDocumentUseCase(
  repository,
  aiService,
);

export const documentController = new DocumentController(
  uploadDocumentUseCase,
  new ListDocumentsUseCase(repository),
  new GetDocumentUseCase(repository),
  new DeleteDocumentUseCase(repository),
  summarizeDocumentUseCase,
  new RenameDocumentUseCase(repository),
);
