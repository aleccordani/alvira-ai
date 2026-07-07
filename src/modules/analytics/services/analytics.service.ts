import { api } from "../../../lib/api";
import type { AnalyticsStats } from "../types";

export const analyticsService = {
  async getStats(): Promise<AnalyticsStats> {
    const { data } = await api.get("/analytics/stats");
    return data;
  },
};