export type UserEntity = {
  id: string;
  name: string;
  email: string;
  password: string;
  planId: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export interface AuthRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  createUser(data: CreateUserInput): Promise<UserEntity>;
}
