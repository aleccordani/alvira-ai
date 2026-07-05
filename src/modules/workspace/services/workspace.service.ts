import type { CreateWorkspacePayload } from "../types";
import * as workspaceApi from "../api/workspace.api";

export const workspaceService = {
  getWorkspaces: () => workspaceApi.getWorkspaces(),

  createWorkspace: (payload: CreateWorkspacePayload) =>
    workspaceApi.createWorkspace(payload),

  uploadWorkspaceDocument: workspaceApi.uploadWorkspaceDocument,
  askWorkspace: workspaceApi.askWorkspace,
  getWorkspaceFiles: workspaceApi.getWorkspaceFiles,
  deleteWorkspaceFile: workspaceApi.deleteWorkspaceFile,
};
