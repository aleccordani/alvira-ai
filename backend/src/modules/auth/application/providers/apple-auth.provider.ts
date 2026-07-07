import { AuthProvider } from "./auth-provider.js";

export class GoogleAuthProvider implements AuthProvider {
  async login(data: unknown) {
    console.log(data);

    return {
      token: "",
      user: {},
    };
  }
}