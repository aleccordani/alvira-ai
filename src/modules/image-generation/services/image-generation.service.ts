import { api } from "../../../lib/api";

import type {
  GeneratedImage,
  GenerateImageRequest,
  GenerateImageResponse,
} from "../types";

type GenerateImageApiResponse = {
  success?: boolean;
  image?: string;
  data?: {
    image?: string;
  };
};

type ImageHistoryApiResponse = {
  success?: boolean;
  data?: GeneratedImage[];
};

export const imageGenerationService = {
  async generate(
    payload: GenerateImageRequest,
  ): Promise<GenerateImageResponse> {
    const response = await api.post<GenerateImageApiResponse>(
      "/image/generate",
      payload,
    );

    const image = response.data.data?.image ?? response.data.image ?? "";

    if (!image) {
      throw new Error("Image URL was not returned by the backend.");
    }

    return {
      image,
    };
  },

  async delete(imageId: string): Promise<void> {
    await api.delete(`/image/${imageId}`);
  },

  async getHistory(): Promise<GeneratedImage[]> {
    const response = await api.get<ImageHistoryApiResponse | GeneratedImage[]>(
      "/image/history",
    );

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return response.data.data ?? [];
  },
};
