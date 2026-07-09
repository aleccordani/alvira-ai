import { api } from "../../../lib/api";
import type {
  AskWorkspaceResponse,
  CreateWorkspacePayload,
  Workspace,
  WorkspaceDocument,
} from "../types";

export async function getWorkspaces(): Promise<Workspace[]> {
  const { data } = await api.get("/workspaces");

  return data.data ?? data;
}

export async function createWorkspace(
  payload: CreateWorkspacePayload,
): Promise<Workspace> {
  const { data } = await api.post("/workspaces", payload);

  return data.data ?? data;
}

export async function uploadWorkspaceDocument(
  workspaceId: string,
  file: File,
): Promise<WorkspaceDocument> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(`/workspaces/${workspaceId}/files`, formData);

  return data.data ?? data;
}

export async function askWorkspace(
  workspaceId: string,
  question: string,
): Promise<AskWorkspaceResponse> {
  const { data } = await api.post(`/workspaces/${workspaceId}/chat`, {
    question,
  });

  return data.data ?? data;
}

export async function getWorkspaceFiles(
  workspaceId: string,
): Promise<WorkspaceDocument[]> {
  const { data } = await api.get(`/workspaces/${workspaceId}/files`);

  return data.data ?? data;
}

export async function deleteWorkspaceFile(
  workspaceId: string,
  fileId: string,
): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/files/${fileId}`);
}

export async function renameWorkspaceFile(
  workspaceId: string,
  fileId: string,
  filename: string,
): Promise<WorkspaceDocument> {
  const { data } = await api.patch(
    `/workspaces/${workspaceId}/files/${fileId}`,
    {
      filename,
    },
  );

  return data.data ?? data;
}
