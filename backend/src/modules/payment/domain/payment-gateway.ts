export type CheckoutRequest = {
  orderId: string;
  amount: number;

  customer: {
    id: string;
    name: string;
    email: string;
  };
};

export type CheckoutResponse = {
  token: string;
  redirectUrl: string;
};

export interface PaymentGateway {
  createCheckout(request: CheckoutRequest): Promise<CheckoutResponse>;
}
