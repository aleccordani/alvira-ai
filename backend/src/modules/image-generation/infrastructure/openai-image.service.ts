import OpenAI from "openai";
import type { ImageProvider } from "../domain/image-provider.js";

export class OpenAIImageService implements ImageProvider {
  private readonly client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generate(prompt: string): Promise<string> {
    const result = await this.client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const base64 = result.data?.[0]?.b64_json;

    if (!base64) {
      throw new Error("Image generation failed");
    }

    return `data:image/png;base64,${base64}`;
  }
}
