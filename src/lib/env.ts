const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const authBaseUrl = import.meta.env.VITE_AUTH_BASE_URL?.trim();

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

if (!authBaseUrl) {
  throw new Error("VITE_AUTH_BASE_URL is not configured");
}

export const frontendEnv = {
  API_BASE_URL: apiBaseUrl.replace(/\/$/, ""),
  AUTH_BASE_URL: authBaseUrl.replace(/\/$/, ""),
};
