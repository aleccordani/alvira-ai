import { Router } from "express";
import { AuthService } from "../application/auth.service.js";
import { PrismaAuthRepository } from "../infrastructure/prisma-auth.repository.js";
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const router = Router();

const authRepository = new PrismaAuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);

export default router;
