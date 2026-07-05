import { OpenAIProvider } from "../ai/infrastructure/openai.provider.js";
import { IngestWorkspaceFileUseCase } from "./application/ingest-workspace-file.usecase.js";
import { SearchWorkspaceUseCase } from "./application/search-workspace.usecase.js";
import { AskWorkspaceUseCase } from "./application/ask-workspace.usecase.js";
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
);
