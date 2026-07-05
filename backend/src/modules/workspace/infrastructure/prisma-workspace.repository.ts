import { prisma } from "../../../lib/prisma.js";
import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceRepository,
} from "../domain/workspace.repository.js";

export class PrismaWorkspaceRepository implements WorkspaceRepository {
  async create(data: CreateWorkspaceInput) {
    return prisma.workspace.create({
      data,
    });
  }

  async findByUserId(userId: string) {
    return prisma.workspace.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.workspace.findUnique({
      where: {
        id,
      },
    });
  }

  async update(data: UpdateWorkspaceInput) {
    return prisma.workspace.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  async delete(id: string) {
    await prisma.workspace.delete({
      where: {
        id,
      },
    });
  }
}
