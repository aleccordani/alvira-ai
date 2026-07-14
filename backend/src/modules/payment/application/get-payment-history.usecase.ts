import type { PaymentRepository } from "../domain/payment.repository.js";

export class GetPaymentHistoryUseCase {
  constructor(
    private readonly repository: PaymentRepository,
  ) {}

  async execute(userId: string) {
    return this.repository.findByUserId(userId);
  }
}