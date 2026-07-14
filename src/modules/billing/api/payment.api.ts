import { api } from "../../../lib/api";

export type CheckoutResponse = {
  token: string;
  redirectUrl: string;
};

export type PaymentHistoryItem = {
  id: string;
  amount: number;
  status: string;
  provider: string;
  createdAt: string;
  plan: {
    name: string;
  } | null;
};

export async function createCheckout(): Promise<CheckoutResponse> {
  const { data } = await api.post("/payment/checkout");

  return data.data ?? data;
}

export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  const { data } = await api.get("/payment/history");

  return data.data ?? data;
}