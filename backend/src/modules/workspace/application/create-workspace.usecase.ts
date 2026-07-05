import {
  CreateWorkspaceInput,
  WorkspaceRepository,
} from "../domain/workspace.repository.js";

export class CreateWorkspaceUseCase {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async execute(input: CreateWorkspaceInput) {
    return this.workspaceRepository.create(input);
  }
}
