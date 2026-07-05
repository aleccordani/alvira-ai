export type WorkspaceEntity = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateWorkspaceInput = {
  name: string;
  description?: string | null;
  userId: string;
};

export type UpdateWorkspaceInput = {
  id: string;
  name?: string;
  description?: string | null;
};

export interface WorkspaceRepository {
  create(data: CreateWorkspaceInput): Promise<WorkspaceEntity>;
  findByUserId(userId: string): Promise<WorkspaceEntity[]>;
  findById(id: string): Promise<WorkspaceEntity | null>;
  update(data: UpdateWorkspaceInput): Promise<WorkspaceEntity>;
  delete(id: string): Promise<void>;
}
