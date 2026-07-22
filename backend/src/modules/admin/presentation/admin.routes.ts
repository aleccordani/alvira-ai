import { Router } from "express";

import { adminMiddleware } from "../../../middlewares/admin.middleware.js";
import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";

import { GetAdminDashboardUseCase } from "../application/get-admin-dashboard.usecase.js";
import { GetAdminUsersUseCase } from "../application/get-admin-users.usecase.js";
import { ManageAdminUserUseCase } from "../application/manage-admin-user.usecase.js";
import { AdminController } from "./admin.controller.js";

const router = Router();

const getAdminDashboardUseCase = new GetAdminDashboardUseCase();

const getAdminUsersUseCase = new GetAdminUsersUseCase();

const manageAdminUserUseCase = new ManageAdminUserUseCase();

const controller = new AdminController(
  getAdminDashboardUseCase,
  getAdminUsersUseCase,
  manageAdminUserUseCase,
);

router.use(betterAuthMiddleware, adminMiddleware);

router.get("/dashboard", controller.dashboard);

router.get("/users", controller.users);

router.patch("/users/:id", controller.manageUser);

export default router;
