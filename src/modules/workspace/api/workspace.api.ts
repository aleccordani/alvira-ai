import type {
  AskWorkspaceResponse,
  CreateWorkspacePayload,
  Workspace,
  WorkspaceDocument,
} from "../types";
import { parseResponse } from "../../../shared/api/http";
import { getToken } from "../../../lib/token";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

export async function getWorkspaces(): Promise<Workspace[]> {
  const res = await fetch(`${API_URL}/workspaces`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch workspaces");
  }

  return parseResponse<Workspace[]>(res);
}

export async function createWorkspace(
  payload: CreateWorkspacePayload,
): Promise<Workspace> {
  const res = await fetch(`${API_URL}/workspaces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create workspace");
  }

  return parseResponse<Workspace>(res);
}

export async function uploadWorkspaceDocument(
  workspaceId: string,
  file: File,
): Promise<WorkspaceDocument> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/workspaces/${workspaceId}/files`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload document");
  }

  return parseResponse<WorkspaceDocument>(res);
}

export async function askWorkspace(
  workspaceId: string,
  question: string,
): Promise<AskWorkspaceResponse> {
  const res = await fetch(`${API_URL}/workspaces/${workspaceId}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error("Failed to ask workspace AI");
  }

  return parseResponse<AskWorkspaceResponse>(res);
}

export async function getWorkspaceFiles(
  workspaceId: string,
): Promise<WorkspaceDocument[]> {
  const res = await fetch(`${API_URL}/workspaces/${workspaceId}/files`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch workspace files");
  }

  const json = await res.json();

  return json.data;
}
