import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";
import { prisma } from "../lib/prisma.js";

export async function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin only",
    });
  }

  return next();
}
