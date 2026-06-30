import { Request, Response } from "express";
import { AuthService } from "../application/auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/response.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await this.authService.register(validatedData);

      return successResponse(res, "Register success", result, 201);
    } catch (error) {
      return errorResponse(
        res,
        error instanceof Error ? error.message : "Register failed",
        400,
      );
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);

      return successResponse(res, "Login success", result);
    } catch (error) {
      return errorResponse(
        res,
        error instanceof Error ? error.message : "Login failed",
        400,
      );
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const result = await this.authService.me(userId);

      return successResponse(res, "Get current user success", result);
    } catch (error) {
      return errorResponse(
        res,
        error instanceof Error ? error.message : "Unauthorized",
        401,
      );
    }
  };
}
