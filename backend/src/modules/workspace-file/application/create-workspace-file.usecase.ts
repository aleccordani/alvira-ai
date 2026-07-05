import {
  CreateWorkspaceFileInput,
  WorkspaceFileRepository,
} from "../domain/workspace-file.repository.js";

export class CreateWorkspaceFileUseCase {
  constructor(
    private readonly workspaceFileRepository: WorkspaceFileRepository,
  ) {}

  async execute(input: CreateWorkspaceFileInput) {
    return this.workspaceFileRepository.create(input);
  }
}
