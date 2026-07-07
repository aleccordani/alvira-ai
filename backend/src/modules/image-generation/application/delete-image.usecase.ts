import type { ImageRepository } from "../domain/image.repository.js";

export class DeleteImageUseCase {
  constructor(private readonly repository: ImageRepository) {}

  async execute(userId: string, imageId: string) {
    return this.repository.delete(userId, imageId);
  }
}
