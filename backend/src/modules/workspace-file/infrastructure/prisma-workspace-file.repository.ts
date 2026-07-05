import { prisma } from "../../../lib/prisma.js";

import {
  WorkspaceFileRepository,
  CreateWorkspaceFileInput,
} from "../domain/workspace-file.repository.js";

export class PrismaWorkspaceFileRepository implements WorkspaceFileRepository {
  async create(data: CreateWorkspaceFileInput) {
    return prisma.workspaceFile.create({
      data,
    });
  }

  async findByWorkspaceId(workspaceId: string) {
    return prisma.workspaceFile.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.workspaceFile.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<CreateWorkspaceFileInput>) {
    return prisma.workspaceFile.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await prisma.workspaceFile.delete({
      where: { id },
    });
  }
}
