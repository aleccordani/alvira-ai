import { api } from "../../../lib/api";
import type { DashboardStats } from "../types";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get("/dashboard/stats");

    return data;
  },
};