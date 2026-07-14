import { api } from "../../../lib/api";

export type CheckoutResponse = {
  token: string;
  redirectUrl: string;
};

export async function createCheckout(): Promise<CheckoutResponse> {
  const { data } = await api.post("/payment/checkout");

  return data.data ?? data;
}
