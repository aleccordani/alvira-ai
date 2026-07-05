import { WorkspaceFileRepository } from "../domain/workspace-file.repository.js";

export class GetWorkspaceFilesUseCase {
  constructor(
    private readonly workspaceFileRepository: WorkspaceFileRepository,
  ) {}

  async execute(workspaceId: string) {
    return this.workspaceFileRepository.findByWorkspaceId(workspaceId);
  }
}
