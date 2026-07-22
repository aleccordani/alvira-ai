import { createAuthClient } from "better-auth/react";
import { frontendEnv } from "./env";

export const authClient = createAuthClient({
  baseURL: frontendEnv.AUTH_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
});