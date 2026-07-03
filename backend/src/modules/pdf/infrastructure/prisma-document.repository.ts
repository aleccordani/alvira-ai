import { prisma } from "../../../lib/prisma.js";
import {
  CreateDocumentInput,
  DocumentRepository,
} from "../domain/document.repository.js";

export class PrismaDocumentRepository implements DocumentRepository {
  async create(data: CreateDocumentInput) {
    return prisma.document.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string) {
    return prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(document: Awaited<ReturnType<DocumentRepository["findById"]>>) {
    if (!document) {
      throw new Error("Document not found");
    }

    return prisma.document.update({
      where: { id: document.id },
      data: document,
    });
  }

  async delete(id: string) {
    await prisma.document.delete({
      where: { id },
    });
  }
}
