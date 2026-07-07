import { prisma } from "../../../lib/prisma.js";
import type {
  CreateImageInput,
  GeneratedImageEntity,
  ImageRepository,
} from "../domain/image.repository.js";

export class PrismaImageRepository implements ImageRepository {
  create(data: CreateImageInput): Promise<GeneratedImageEntity> {
    return prisma.generatedImage.create({
      data,
    });
  }

  findByUserId(userId: string): Promise<GeneratedImageEntity[]> {
    return prisma.generatedImage.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async delete(userId: string, imageId: string): Promise<void> {
    await prisma.generatedImage.deleteMany({
      where: {
        id: imageId,
        userId,
      },
    });
  }
}
