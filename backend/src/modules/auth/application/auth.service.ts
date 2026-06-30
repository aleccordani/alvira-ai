import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../domain/auth.repository.js";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(data: RegisterInput) {
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.authRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        planId: user.planId,
        avatar: user.avatar,
      },
      token,
    };
  }

  async login(data: LoginInput) {
    const user = await this.authRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        planId: user.planId,
        avatar: user.avatar,
      },
      token,
    };
  }

  private generateToken(userId: string) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign({ userId }, secret, {
      expiresIn: "7d",
    });
  }

  async me(userId: string) {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      planId: user.planId,
      createdAt: user.createdAt,
    };
  }
}
