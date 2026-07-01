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

  async streamReply(
    messages: { role: "system" | "user" | "assistant"; content: string }[],
    onChunk: (chunk: string) => void,
  ) {
    if (!this.client) {
      const dummy =
        "OpenAI API key belum tersedia. Ini response dummy streaming dari Alvira.";

      for (const word of dummy.split(" ")) {
        onChunk(word + " ");
        await new Promise((resolve) => setTimeout(resolve, 80));
      }

      return dummy;
    }

    try {
      const stream = await this.client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages,
        stream: true,
      });

      let fullText = "";

      for await (const part of stream) {
        const chunk = part.choices[0]?.delta?.content || "";

        if (chunk) {
          fullText += chunk;
          onChunk(chunk);
        }
      }

      return fullText;
    } catch (error) {
      console.error("OpenAI stream error:", error);

      const fallback =
        "OpenAI quota belum tersedia. Ini response dummy streaming sementara dari Alvira.";

      for (const word of fallback.split(" ")) {
        onChunk(word + " ");
        await new Promise((resolve) => setTimeout(resolve, 80));
      }

      return fallback;
    }
  }

  async generateTitle(content: string): Promise<string> {
    const cleaned = content
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[^\w\sÀ-ÿ]/g, "");

    if (!cleaned) return "New Chat";

    const stopWords = [
      "tolong",
      "coba",
      "dong",
      "please",
      "jelaskan",
      "explain",
      "how",
      "to",
      "cara",
      "itu",
      "apa",
      "yang",
    ];

    const words = cleaned
      .split(" ")
      .filter((word) => !stopWords.includes(word.toLowerCase()))
      .slice(0, 6);

    const title = words.join(" ").trim();

    return title || cleaned.slice(0, 40) || "New Chat";
  }
}
