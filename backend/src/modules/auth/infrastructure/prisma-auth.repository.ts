import { prisma } from "../../../lib/prisma.js";
import {
  AuthRepository,
  CreateUserInput,
  UserEntity,
} from "../domain/auth.repository.js";

export class PrismaAuthRepository implements AuthRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: CreateUserInput): Promise<UserEntity> {
    return prisma.user.create({
      data,
    });
  }
  
  async findById(id: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
