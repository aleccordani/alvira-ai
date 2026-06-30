import OpenAI from "openai";
import { env } from "../../../config/env.js";

export class OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    if (env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });
    }
  }

  async generateReply(
    messages: { role: "system" | "user" | "assistant"; content: string }[],
  ) {
    if (!this.client) {
      return "OpenAI API key belum tersedia. Ini response dummy dari Alvira.";
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages,
      });

      return completion.choices[0]?.message?.content || "Tidak ada response.";
    } catch (error) {
      console.error("OpenAI error:", error);

      return "OpenAI quota belum tersedia. Ini response dummy sementara dari Alvira.";
    }
  }

  async generateTitle(content: string): Promise<string> {
    const cleanTitle = content.trim().slice(0, 40);

    return cleanTitle || "New Chat";
  }
}
