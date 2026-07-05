export interface Workspace {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceDocument {
  id: string;
  workspaceId: string;
  filename: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
}

export interface AskWorkspaceResponse {
  answer: string;
}

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
}
