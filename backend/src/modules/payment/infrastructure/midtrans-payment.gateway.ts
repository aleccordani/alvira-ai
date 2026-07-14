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

  constructor() {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey && process.env.PAYMENT_MOCK !== "true") {
      throw new Error("MIDTRANS_SERVER_KEY is not configured");
    }

    this.snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: serverKey ?? "mock-server-key",
      clientKey: process.env.MIDTRANS_CLIENT_KEY ?? "mock-client-key",
    });
  }

  async createCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
    if (process.env.PAYMENT_MOCK === "true") {
      return {
        token: `mock-token-${request.orderId}`,
        redirectUrl: `http://localhost:3000/?payment=mock-success&orderId=${request.orderId}`,
      };
    }

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
          name: "ALVIRA Pro Subscription",
        },
      ],
    })) as SnapTransactionResponse;

    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  }
}
