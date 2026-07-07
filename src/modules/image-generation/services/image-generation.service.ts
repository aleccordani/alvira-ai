import { api } from "../../../lib/api";

import type {
  GeneratedImage,
  GenerateImageRequest,
  GenerateImageResponse,
} from "../types";

export const imageGenerationService = {
  async generate(
    payload: GenerateImageRequest,
  ): Promise<GenerateImageResponse> {
    const { data } = await api.post("/image/generate", payload);

    return data;
  },

  async delete(imageId: string): Promise<void> {
    await api.delete(`/image/${imageId}`);
  },

  async getHistory(): Promise<GeneratedImage[]> {
    const { data } = await api.get("/image/history");

    return data;
  },
};
