import { api } from "../../../lib/api";
import type { BillingOverview } from "../types";

export async function getMyBilling(): Promise<BillingOverview> {
  const { data } = await api.get("/billing/me");

  return data.data ?? data;
}
