import { WorkspaceFileRepository } from "../domain/workspace-file.repository.js";

export class RenameWorkspaceFileUseCase {
  constructor(private readonly repository: WorkspaceFileRepository) {}

  async execute(workspaceId: string, fileId: string, filename: string) {
    if (!filename || !filename.trim()) {
      throw new Error("Filename is required.");
    }

    const file = await this.repository.findById(fileId);

    if (!file || file.workspaceId !== workspaceId) {
      throw new Error("Workspace file not found.");
    }

    return this.repository.update(fileId, {
      filename: filename.trim(),
    });
  }
}
