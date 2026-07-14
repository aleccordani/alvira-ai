import { CreateCheckoutUseCase } from "../modules/payment/application/create-checkout.usecase.js";
import { GetPaymentHistoryUseCase } from "../modules/payment/application/get-payment-history.usecase.js";
import { PaymentWebhookUseCase } from "../modules/payment/application/payment-webhook.usecase.js";
import { MidtransPaymentGateway } from "../modules/payment/infrastructure/midtrans-payment.gateway.js";
import { PrismaPaymentRepository } from "../modules/payment/infrastructure/prisma-payment.repository.js";
import { PaymentController } from "../modules/payment/presentation/payment.controller.js";

const paymentRepository = new PrismaPaymentRepository();
const paymentGateway = new MidtransPaymentGateway();

const createCheckoutUseCase = new CreateCheckoutUseCase(
  paymentRepository,
  paymentGateway,
);

const getPaymentHistoryUseCase = new GetPaymentHistoryUseCase(
  paymentRepository,
);

const paymentWebhookUseCase = new PaymentWebhookUseCase();

export const paymentController = new PaymentController(
  new CreateCheckoutUseCase(paymentRepository, paymentGateway),
  new GetPaymentHistoryUseCase(paymentRepository),
  new PaymentWebhookUseCase(),
);
