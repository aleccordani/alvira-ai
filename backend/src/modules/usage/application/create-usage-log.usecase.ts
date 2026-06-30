import {
  CreateUsageLogInput,
  UsageRepository,
} from "../domain/usage.repository.js";

export class CreateUsageLogUseCase {
  constructor(private readonly repository: UsageRepository) {}

  async execute(data: CreateUsageLogInput) {
    return this.repository.create(data);
  }
}
