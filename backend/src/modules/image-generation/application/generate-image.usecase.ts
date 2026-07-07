import type { ImageProvider } from "../domain/image-provider.js";
import type { ImageRepository } from "../domain/image.repository.js";

export interface GenerateImageRequest {
  userId: string;
  prompt: string;
}

export class GenerateImageUseCase {
  constructor(
    private readonly provider: ImageProvider,
    private readonly repository: ImageRepository,
  ) {}

  async execute(request: GenerateImageRequest) {
    console.log("GenerateImageUseCase request:", request);

    const imageUrl = await this.provider.generate(request.prompt);

    console.log("Image generated:", imageUrl.substring(0, 50));

    await this.repository.create({
      userId: request.userId,
      prompt: request.prompt,
      imageUrl,
    });

    console.log("Saved to database");

    return imageUrl;
  }
}
