import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

export interface BetterAuthRequest extends Request {
  user?: {
    userId: string;
    id: string;
    email: string;
    name: string;
  };
}

export async function betterAuthMiddleware(
  req: BetterAuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user) {
      req.user = {
        userId: session.user.id,
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      };

      return next();
    }

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      const dbSession = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (dbSession && dbSession.expiresAt > new Date()) {
        req.user = {
          userId: dbSession.user.id,
          id: dbSession.user.id,
          email: dbSession.user.email,
          name: dbSession.user.name,
        };

        return next();
      }
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  } catch (error) {
    console.error("Better Auth middleware error:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}
