import { PrismaWorkspaceFileRepository } from "../modules/workspace-file/infrastructure/prisma-workspace-file.repository.js";
import { CreateWorkspaceFileUseCase } from "../modules/workspace-file/application/create-workspace-file.usecase.js";
import { GetWorkspaceFilesUseCase } from "../modules/workspace-file/application/get-workspace-files.usecase.js";
import { WorkspaceFileController } from "../modules/workspace-file/presentation/workspace-file.controller.js";
import { DeleteWorkspaceFileUseCase } from "../modules/workspace-file/application/delete-workspace-file.usecase.js";

const workspaceFileRepository = new PrismaWorkspaceFileRepository();

export const workspaceFileController = new WorkspaceFileController(
  new CreateWorkspaceFileUseCase(workspaceFileRepository),
  new GetWorkspaceFilesUseCase(workspaceFileRepository),
  new DeleteWorkspaceFileUseCase(workspaceFileRepository),
);
