import { prisma } from "../../../lib/prisma.js";

export interface DashboardStats {
  conversations: number;
  workspaces: number;
  documents: number;
  generatedImages: number;
  aiRequests: number;
}

export class GetDashboardStatsUseCase {
  async execute(userId: string): Promise<DashboardStats> {
    const [conversations, workspaces, documents, generatedImages, aiRequests] =
      await Promise.all([
        prisma.conversation.count({
          where: { userId },
        }),

        prisma.workspace.count({
          where: { userId },
        }),

        prisma.document.count({
          where: { userId },
        }),

        prisma.generatedImage.count({
          where: { userId },
        }),

        prisma.message.count({
          where: {
            conversation: {
              userId,
            },
          },
        }),
      ]);

    return {
      conversations,
      workspaces,
      documents,
      generatedImages,
      aiRequests,
    };
  }
}
