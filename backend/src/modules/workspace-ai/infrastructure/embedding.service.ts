import OpenAI from "openai";
import { env } from "../../../config/env.js";

export class EmbeddingService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  async createEmbedding(text: string): Promise<number[]> {
    if (env.AI_MOCK) {
      return Array.from({ length: 1536 }, (_, index) => {
        const charCode = text.charCodeAt(index % Math.max(text.length, 1)) || 0;
        return (charCode % 100) / 100;
      });
    }

    const response = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  }
}
