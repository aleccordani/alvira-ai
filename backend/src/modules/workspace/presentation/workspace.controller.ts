import { Request, Response } from "express";
import { successResponse } from "../../../shared/utils/response.js";

import { CreateWorkspaceUseCase } from "../application/create-workspace.usecase.js";
import { GetUserWorkspacesUseCase } from "../application/get-user-workspaces.usecase.js";
import { UpdateWorkspaceUseCase } from "../application/update-workspace.usecase.js";
import { DeleteWorkspaceUseCase } from "../application/delete-workspace.usecase.js";

export class WorkspaceController {
  constructor(
    private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
    private readonly getUserWorkspacesUseCase: GetUserWorkspacesUseCase,
    private readonly updateWorkspaceUseCase: UpdateWorkspaceUseCase,
    private readonly deleteWorkspaceUseCase: DeleteWorkspaceUseCase,
  ) {}

  list = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    const workspaces = await this.getUserWorkspacesUseCase.execute(userId);

    return successResponse(res, "Workspaces fetched successfully.", workspaces);
  };

  create = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    const workspace = await this.createWorkspaceUseCase.execute({
      name: req.body.name,
      description: req.body.description,
      userId,
    });

    return successResponse(res, "Workspace created successfully.", workspace);
  };

  update = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      throw new Error("Workspace id is required.");
    }

    const workspace = await this.updateWorkspaceUseCase.execute({
      id,
      name: req.body.name,
      description: req.body.description,
    });

    return successResponse(res, "Workspace updated successfully.", workspace);
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      throw new Error("Workspace id is required.");
    }

    await this.deleteWorkspaceUseCase.execute(id);

    return successResponse(res, "Workspace deleted successfully.", null);
  };
}
