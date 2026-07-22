import type { UsageRepository } from "../domain/usage.repository.js";

export class CheckCreditsUseCase {
  constructor(private readonly repository: UsageRepository) {}

  async execute(userId: string, requiredCredits: number) {
    if (!userId) {
      throw new Error("USER_ID_REQUIRED");
    }

    const normalizedRequiredCredits = Math.max(0, requiredCredits);
    const balance = await this.repository.getCreditBalance(userId);

    if (balance.creditsRemaining < normalizedRequiredCredits) {
      throw new Error("INSUFFICIENT_CREDITS");
    }

    return balance;
  }
}
