import { WorkspaceRepository } from "../domain/workspace.repository.js";

export class DeleteWorkspaceUseCase {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async execute(id: string) {
    await this.workspaceRepository.delete(id);
  }
}
