import type { AuthProvider, UserRole, UserStatus } from "@prisma/client";

export type UserEntity = {
  id: string;
  name: string;
  email: string;
  password: string | null;
  role: UserRole;
  status: UserStatus;
  provider: AuthProvider;
  providerId: string | null;
  planId: string | null;
  avatar: string | null;
  bio: string | null;
  tokensUsed: number;
  storageUsed: number;
  imageUsed: number;
  workspaceUsed: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password?: string | null;
  provider?: AuthProvider;
  providerId?: string | null;
  avatar?: string | null;
  planId?: string | null;
};

export interface AuthRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  createUser(data: CreateUserInput): Promise<UserEntity>;
}
