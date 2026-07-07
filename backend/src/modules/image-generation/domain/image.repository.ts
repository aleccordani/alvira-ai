export interface CreateImageInput {
  userId: string;
  prompt: string;
  imageUrl: string;
}

export interface GeneratedImageEntity {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
}

export interface ImageRepository {
  create(data: CreateImageInput): Promise<GeneratedImageEntity>;
  findByUserId(userId: string): Promise<GeneratedImageEntity[]>;
  delete(userId: string, imageId: string): Promise<void>;
}
