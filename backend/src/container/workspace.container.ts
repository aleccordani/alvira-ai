import { PrismaWorkspaceRepository } from "../modules/workspace/infrastructure/prisma-workspace.repository.js";

import { CreateWorkspaceUseCase } from "../modules/workspace/application/create-workspace.usecase.js";
import { GetUserWorkspacesUseCase } from "../modules/workspace/application/get-user-workspaces.usecase.js";
import { UpdateWorkspaceUseCase } from "../modules/workspace/application/update-workspace.usecase.js";
import { DeleteWorkspaceUseCase } from "../modules/workspace/application/delete-workspace.usecase.js";

import { WorkspaceController } from "../modules/workspace/presentation/workspace.controller.js";

const workspaceRepository = new PrismaWorkspaceRepository();

export const workspaceController = new WorkspaceController(
  new CreateWorkspaceUseCase(workspaceRepository),
  new GetUserWorkspacesUseCase(workspaceRepository),
  new UpdateWorkspaceUseCase(workspaceRepository),
  new DeleteWorkspaceUseCase(workspaceRepository),
);
