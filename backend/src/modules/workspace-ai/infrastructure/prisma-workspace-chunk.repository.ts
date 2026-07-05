import { prisma } from "../../../lib/prisma.js";
import {
  CreateWorkspaceChunkInput,
  WorkspaceChunkEntity,
  WorkspaceChunkRepository,
} from "../domain/workspace-chunk.repository.js";

function mapToEntity(chunk: {
  id: string;
  workspaceId: string;
  workspaceFileId: string;
  content: string;
  embedding: unknown;
  chunkIndex: number;
  createdAt: Date;
}): WorkspaceChunkEntity {
  return {
    ...chunk,
    embedding: Array.isArray(chunk.embedding)
      ? chunk.embedding.map(Number)
      : [],
  };
}

export class PrismaWorkspaceChunkRepository implements WorkspaceChunkRepository {
  async create(data: CreateWorkspaceChunkInput): Promise<WorkspaceChunkEntity> {
    const chunk = await prisma.workspaceChunk.create({
      data,
    });

    return mapToEntity(chunk);
  }

  async createMany(data: CreateWorkspaceChunkInput[]): Promise<void> {
    await prisma.workspaceChunk.createMany({
      data,
    });
  }

  async findByWorkspaceId(
    workspaceId: string,
  ): Promise<WorkspaceChunkEntity[]> {
    const chunks = await prisma.workspaceChunk.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        chunkIndex: "asc",
      },
    });

    return chunks.map(mapToEntity);
  }
}
