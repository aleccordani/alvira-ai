import axios from "axios";
import { frontendEnv } from "./env";

export const api = axios.create({
  baseURL: `${frontendEnv.API_BASE_URL}/api`,
  withCredentials: true,
  timeout: 60_000,
});
