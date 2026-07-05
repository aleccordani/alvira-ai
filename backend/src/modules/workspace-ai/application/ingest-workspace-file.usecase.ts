import { ChunkService } from "../infrastructure/chunk.service.js";
import { EmbeddingService } from "../infrastructure/embedding.service.js";
import { WorkspaceChunkRepository } from "../domain/workspace-chunk.repository.js";

export interface IngestWorkspaceFileRequest {
  workspaceId: string;
  workspaceFileId: string;
  text: string;
}

export class IngestWorkspaceFileUseCase {
  constructor(
    private readonly chunkService: ChunkService,
    private readonly embeddingService: EmbeddingService,
    private readonly workspaceChunkRepository: WorkspaceChunkRepository,
  ) {}

  async execute(request: IngestWorkspaceFileRequest): Promise<void> {
    console.log("=== INGEST START ===");
    console.log(request);

    const chunks = this.chunkService.split(request.text);

    console.log("Chunks:", chunks.length);

    const data = [];

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await this.embeddingService.createEmbedding(chunks[i]);

      data.push({
        workspaceId: request.workspaceId,
        workspaceFileId: request.workspaceFileId,
        content: chunks[i],
        embedding,
        chunkIndex: i,
      });
    }

    console.log("Data to insert:", data.length);

    await this.workspaceChunkRepository.createMany(data);

    console.log("=== INGEST END ===");
  }
}
