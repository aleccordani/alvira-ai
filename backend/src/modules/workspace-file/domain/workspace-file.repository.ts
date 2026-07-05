export type CreateWorkspaceFileInput = {
  workspaceId: string;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
};

export interface WorkspaceFileRepository {
  create(data: CreateWorkspaceFileInput): Promise<any>;

  findByWorkspaceId(workspaceId: string): Promise<any[]>;

  findById(id: string): Promise<any | null>;

  update(id: string, data: Partial<CreateWorkspaceFileInput>): Promise<any>;

  delete(id: string): Promise<void>;
}
