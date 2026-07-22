import midtransClient from "midtrans-client";

import type {
  CheckoutRequest,
  CheckoutResponse,
  PaymentGateway,
} from "../domain/payment-gateway.js";

type SnapTransactionResponse = {
  token: string;
  redirect_url: string;
};

export class MidtransPaymentGateway implements PaymentGateway {
  private readonly snap: InstanceType<typeof midtransClient.Snap>;
  private readonly frontendUrl: string;

  constructor() {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;
    const isMockMode = process.env.PAYMENT_MOCK === "true";

    this.frontendUrl =
      process.env.FRONTEND_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

    if (!isMockMode && !serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY is not configured");
    }

    if (!isMockMode && !clientKey) {
      throw new Error("MIDTRANS_CLIENT_KEY is not configured");
    }

    this.snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",

      serverKey: serverKey ?? "mock-server-key",

      clientKey: clientKey ?? "mock-client-key",
    });
  }

  async createCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
    if (process.env.PAYMENT_MOCK === "true") {
      return {
        token: `mock-token-${request.orderId}`,
        redirectUrl:
          `${this.frontendUrl}/` +
          `?payment=mock-success` +
          `&orderId=${encodeURIComponent(request.orderId)}`,
      };
    }

    const finishUrl =
      `${this.frontendUrl}/` +
      `?payment=finish` +
      `&orderId=${encodeURIComponent(request.orderId)}`;

    const transaction = (await this.snap.createTransaction({
      transaction_details: {
        order_id: request.orderId,
        gross_amount: request.amount,
      },

      customer_details: {
        first_name: request.customer.name,
        email: request.customer.email,
      },

      item_details: [
        {
          id: "ALVIRA-PRO",
          price: request.amount,
          quantity: 1,
          name: "ALVIRA Pro Studio - 30 Days",
        },
      ],

      callbacks: {
        finish: finishUrl,
      },
    })) as SnapTransactionResponse;

    if (!transaction.token || !transaction.redirect_url) {
      throw new Error("Midtrans did not return a checkout token.");
    }

    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  }
}
