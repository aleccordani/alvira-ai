import { WorkspaceFileRepository } from "../domain/workspace-file.repository.js";

export class DeleteWorkspaceFileUseCase {
  constructor(private readonly repository: WorkspaceFileRepository) {}

  async execute(workspaceId: string, fileId: string) {
    const file = await this.repository.findById(fileId);

    if (!file || file.workspaceId !== workspaceId) {
      throw new Error("Workspace file not found.");
    }

    await this.repository.delete(fileId);
  }
}
