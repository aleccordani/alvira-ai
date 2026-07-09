import { Router } from "express";
import { prisma } from "../../../lib/prisma.js";
import { betterAuthMiddleware } from "../../../middlewares/better-auth.middleware.js";
import { adminMiddleware } from "../../../middlewares/admin.middleware.js";

const router = Router();

router.get(
  "/overview",
  betterAuthMiddleware,
  adminMiddleware,
  async (_req, res) => {
    const [
      totalUsers,
      totalWorkspaces,
      totalWorkspaceFiles,
      totalImages,
      latestUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.workspace.count(),
      prisma.workspaceFile.count(),
      prisma.generatedImage.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalWorkspaces,
          totalWorkspaceFiles,
          totalImages,
          revenue: 0,
        },
        latestUsers,
      },
    });
  },
);

export default router;
