import * as paymentApi from "../api/payment.api";

export const paymentService = {
  createCheckout: paymentApi.createCheckout,
  getPaymentHistory: paymentApi.getPaymentHistory,
};