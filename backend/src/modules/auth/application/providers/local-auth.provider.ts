import { AuthProvider, AuthResult } from "./auth-provider.js";

export class LocalAuthProvider implements AuthProvider<unknown, unknown> {
  async login(data: unknown): Promise<AuthResult<unknown>> {
    throw new Error("LocalAuthProvider is deprecated. Use AuthService login or Better Auth.");
  }
}