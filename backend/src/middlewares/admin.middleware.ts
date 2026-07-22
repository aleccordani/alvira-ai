import type { NextFunction, Response } from "express";

import { prisma } from "../lib/prisma.js";
import type { BetterAuthRequest } from "./better-auth.middleware.js";

export const adminMiddleware = async (
  req: BetterAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      code: "UNAUTHORIZED",
      message: "Unauthorized.",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
      status: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      code: "USER_NOT_FOUND",
      message: "User not found.",
    });
  }

  if (user.status !== "ACTIVE") {
    return res.status(403).json({
      success: false,
      code: "ACCOUNT_SUSPENDED",
      message: "Account is suspended.",
    });
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      code: "ADMIN_REQUIRED",
      message: "Admin access required.",
    });
  }

  return next();
};
