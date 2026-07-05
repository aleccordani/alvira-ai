import {
  UpdateWorkspaceInput,
  WorkspaceRepository,
} from "../domain/workspace.repository.js";

export class UpdateWorkspaceUseCase {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async execute(input: UpdateWorkspaceInput) {
    return this.workspaceRepository.update(input);
  }
}
