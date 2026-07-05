import { WorkspaceRepository } from "../domain/workspace.repository.js";

export class GetUserWorkspacesUseCase {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async execute(userId: string) {
    return this.workspaceRepository.findByUserId(userId);
  }
}
