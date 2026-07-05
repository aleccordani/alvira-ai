import { EmbeddingService } from "../infrastructure/embedding.service.js";
import { VectorService } from "../infrastructure/vector.service.js";
import { WorkspaceChunkRepository } from "../domain/workspace-chunk.repository.js";

export interface SearchWorkspaceRequest {
  workspaceId: string;
  question: string;
  limit?: number;
}

export class SearchWorkspaceUseCase {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorService: VectorService,
    private readonly repository: WorkspaceChunkRepository,
  ) {}

  async execute(request: SearchWorkspaceRequest) {
    const questionEmbedding = await this.embeddingService.createEmbedding(
      request.question,
    );

    const chunks = await this.repository.findByWorkspaceId(request.workspaceId);

    const ranked = chunks
      .map((chunk) => ({
        chunk,
        score: this.vectorService.cosineSimilarity(
          questionEmbedding,
          chunk.embedding,
        ),
      }))
      .sort((a, b) => b.score - a.score);

    return ranked.slice(0, request.limit ?? 5);
  }
}
