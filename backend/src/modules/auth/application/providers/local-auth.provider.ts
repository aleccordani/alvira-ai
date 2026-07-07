import { AuthProvider } from "./auth-provider.js";

export class LocalAuthProvider implements AuthProvider {
  async login(data: unknown) {
    throw new Error("Not implemented yet.");
  }
}
