export interface WorkspaceChunkEntity {
  id: string;
  workspaceId: string;
  workspaceFileId: string;
  content: string;
  embedding: number[];
  chunkIndex: number;
  createdAt: Date;
}

export interface CreateWorkspaceChunkInput {
  workspaceId: string;
  workspaceFileId: string;
  content: string;
  embedding: number[];
  chunkIndex: number;
}

export interface WorkspaceChunkRepository {
  create(data: CreateWorkspaceChunkInput): Promise<WorkspaceChunkEntity>;

  createMany(data: CreateWorkspaceChunkInput[]): Promise<void>;

  findByWorkspaceId(workspaceId: string): Promise<WorkspaceChunkEntity[]>;
}
