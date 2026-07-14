import { CreateCheckoutUseCase } from "../modules/payment/application/create-checkout.usecase.js";
import { MidtransPaymentGateway } from "../modules/payment/infrastructure/midtrans-payment.gateway.js";
import { PrismaPaymentRepository } from "../modules/payment/infrastructure/prisma-payment.repository.js";
import { PaymentController } from "../modules/payment/presentation/payment.controller.js";

const repository = new PrismaPaymentRepository();
const gateway = new MidtransPaymentGateway();

const createCheckoutUseCase = new CreateCheckoutUseCase(repository, gateway);

export const paymentController = new PaymentController(createCheckoutUseCase);
