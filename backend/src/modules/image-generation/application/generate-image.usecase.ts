import { CheckCreditsUseCase } from "../../usage/application/check-credits.usecase.js";
import { CreateUsageLogUseCase } from "../../usage/application/create-usage-log.usecase.js";
import type { ImageProvider } from "../domain/image-provider.js";
import type { ImageRepository } from "../domain/image.repository.js";

export interface GenerateImageRequest {
  userId: string;
  prompt: string;
}

const IMAGE_GENERATION_CREDIT_COST = 300;

export class GenerateImageUseCase {
  constructor(
    private readonly provider: ImageProvider,
    private readonly repository: ImageRepository,
    private readonly checkCreditsUseCase: CheckCreditsUseCase,
    private readonly createUsageLogUseCase: CreateUsageLogUseCase,
  ) {}

  async execute(request: GenerateImageRequest) {
    const cleanPrompt = request.prompt.trim();

    if (!cleanPrompt) {
      throw new Error("PROMPT_REQUIRED");
    }

    // Periksa saldo sebelum memanggil provider image.
    await this.checkCreditsUseCase.execute(
      request.userId,
      IMAGE_GENERATION_CREDIT_COST,
    );

    const imageUrl = await this.provider.generate(cleanPrompt);

    await this.repository.create({
      userId: request.userId,
      prompt: cleanPrompt,
      imageUrl,
    });

    // Potong kredit hanya ketika generate dan penyimpanan berhasil.
    await this.createUsageLogUseCase.execute({
      userId: request.userId,
      model: "image-generation",
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: IMAGE_GENERATION_CREDIT_COST,
      creditsToConsume: IMAGE_GENERATION_CREDIT_COST,
      cost: 0,
    });

    return imageUrl;
  }
}
