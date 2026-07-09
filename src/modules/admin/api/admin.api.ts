import { api } from "../../../lib/api";
import type { AdminOverview } from "../types";

export async function getOverview(): Promise<AdminOverview> {
  const { data } = await api.get("/admin/overview");

  return data.data;
}
