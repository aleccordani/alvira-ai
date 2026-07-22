import type { Response } from "express";
import { PlanType } from "@prisma/client";

import type { BetterAuthRequest } from "../../../middlewares/better-auth.middleware.js";
import { GetAdminDashboardUseCase } from "../application/get-admin-dashboard.usecase.js";
import { GetAdminUsersUseCase } from "../application/get-admin-users.usecase.js";
import {
  type ManageAdminUserAction,
  ManageAdminUserUseCase,
} from "../application/manage-admin-user.usecase.js";

export class AdminController {
  constructor(
    private readonly getAdminDashboardUseCase: GetAdminDashboardUseCase,
    private readonly getAdminUsersUseCase: GetAdminUsersUseCase,
    private readonly manageAdminUserUseCase: ManageAdminUserUseCase,
  ) {}

  dashboard = async (_req: BetterAuthRequest, res: Response) => {
    try {
      const dashboard = await this.getAdminDashboardUseCase.execute();

      return res.json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      console.error("GET ADMIN DASHBOARD ERROR:", error);

      return res.status(500).json({
        success: false,
        code: "ADMIN_DASHBOARD_FAILED",
        message: "Failed to load admin dashboard.",
      });
    }
  };

  users = async (_req: BetterAuthRequest, res: Response) => {
    try {
      const users = await this.getAdminUsersUseCase.execute();

      return res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error("GET ADMIN USERS ERROR:", error);

      return res.status(500).json({
        success: false,
        code: "ADMIN_USERS_FAILED",
        message: "Failed to load admin users.",
      });
    }
  };

  manageUser = async (req: BetterAuthRequest, res: Response) => {
    const actorUserId = req.user?.userId;

    const targetUserId = typeof req.params.id === "string" ? req.params.id : "";

    const action = req.body?.action as ManageAdminUserAction | undefined;

    const planType = req.body?.planType as PlanType | undefined;

    if (!actorUserId) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Unauthorized.",
      });
    }

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        code: "TARGET_USER_ID_REQUIRED",
        message: "Target user id is required.",
      });
    }

    if (!action) {
      return res.status(400).json({
        success: false,
        code: "ACTION_REQUIRED",
        message: "Admin action is required.",
      });
    }

    try {
      const result = await this.manageAdminUserUseCase.execute({
        targetUserId,
        actorUserId,
        action,
        planType,
      });

      return res.json({
        success: true,
        message: "User updated successfully.",
        data: result,
      });
    } catch (error) {
      const code =
        error instanceof Error ? error.message : "ADMIN_USER_UPDATE_FAILED";

      const status =
        code === "USER_NOT_FOUND" || code === "PLAN_NOT_FOUND"
          ? 404
          : code === "CANNOT_SUSPEND_SELF"
            ? 409
            : code === "PLAN_TYPE_REQUIRED" ||
                code === "INVALID_ADMIN_ACTION" ||
                code === "TARGET_USER_ID_REQUIRED"
              ? 400
              : 500;

      console.error("MANAGE ADMIN USER ERROR:", error);

      return res.status(status).json({
        success: false,
        code,
        message:
          code === "CANNOT_SUSPEND_SELF"
            ? "You cannot suspend your own admin account."
            : code === "PLAN_NOT_FOUND"
              ? "Plan not found."
              : code === "USER_NOT_FOUND"
                ? "User not found."
                : code === "PLAN_TYPE_REQUIRED"
                  ? "Plan type is required."
                  : "Failed to update user.",
      });
    }
  };
}
