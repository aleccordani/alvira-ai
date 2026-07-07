export interface GenerateImageRequest {
  prompt: string;
}

export interface GenerateImageResponse {
  image: string;
}

export interface GeneratedImage {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
}
