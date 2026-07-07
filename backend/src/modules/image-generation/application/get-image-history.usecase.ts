import type {
  GeneratedImageEntity,
  ImageRepository,
} from "../domain/image.repository.js";

export class GetImageHistoryUseCase {
  constructor(private readonly repository: ImageRepository) {}

  execute(userId: string): Promise<GeneratedImageEntity[]> {
    return this.repository.findByUserId(userId);
  }
}
