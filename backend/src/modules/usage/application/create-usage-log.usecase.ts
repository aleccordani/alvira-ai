import type {
  CreateUsageLogInput,
  UsageRepository,
} from "../domain/usage.repository.js";

export class CreateUsageLogUseCase {
  constructor(private readonly repository: UsageRepository) {}

  async execute(data: CreateUsageLogInput) {
    if (!data.userId) {
      throw new Error("User id is required");
    }

    const creditsToConsume = Math.max(0, data.creditsToConsume ?? 0);

    return this.repository.create({
      ...data,
      creditsToConsume,
    });
  }
}
