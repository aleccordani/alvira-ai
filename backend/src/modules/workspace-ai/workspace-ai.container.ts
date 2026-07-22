import { OpenAIProvider } from "../ai/infrastructure/openai.provider.js";
import { CheckCreditsUseCase } from "../usage/application/check-credits.usecase.js";
import { CreateUsageLogUseCase } from "../usage/application/create-usage-log.usecase.js";
import { PrismaUsageRepository } from "../usage/infrastructure/prisma-usage.repository.js";

import { AskWorkspaceUseCase } from "./application/ask-workspace.usecase.js";
import { IngestWorkspaceFileUseCase } from "./application/ingest-workspace-file.usecase.js";
import { SearchWorkspaceUseCase } from "./application/search-workspace.usecase.js";

import { ChunkService } from "./infrastructure/chunk.service.js";
import { EmbeddingService } from "./infrastructure/embedding.service.js";
import { PrismaWorkspaceChunkRepository } from "./infrastructure/prisma-workspace-chunk.repository.js";
import { PromptBuilderService } from "./infrastructure/prompt-builder.service.js";
import { VectorService } from "./infrastructure/vector.service.js";

const chunkService = new ChunkService();
const embeddingService = new EmbeddingService();
const vectorService = new VectorService();
const promptBuilderService = new PromptBuilderService();

const workspaceChunkRepository = new PrismaWorkspaceChunkRepository();

const usageRepository = new PrismaUsageRepository();

const checkCreditsUseCase = new CheckCreditsUseCase(usageRepository);

const createUsageLogUseCase = new CreateUsageLogUseCase(usageRepository);

const aiProvider = new OpenAIProvider();

export const ingestWorkspaceFileUseCase = new IngestWorkspaceFileUseCase(
  chunkService,
  embeddingService,
  workspaceChunkRepository,
);

export const searchWorkspaceUseCase = new SearchWorkspaceUseCase(
  embeddingService,
  vectorService,
  workspaceChunkRepository,
);

export const askWorkspaceUseCase = new AskWorkspaceUseCase(
  searchWorkspaceUseCase,
  promptBuilderService,
  aiProvider,
  checkCreditsUseCase,
  createUsageLogUseCase,
);
