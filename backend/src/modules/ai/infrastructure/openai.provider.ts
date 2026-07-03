import OpenAI from "openai";
import { env } from "../../../config/env.js";
import { AIProvider } from "../domain/ai-provider.js";
import {
  GenerateAIRequest,
  GenerateAIResponse,
  StreamAIRequest,
} from "../domain/ai.types.js";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI | null = null;

  constructor() {
    if (env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });
    }
  }

  async generate(request: GenerateAIRequest): Promise<GenerateAIResponse> {
    if (!this.client) {
      return {
        content:
          "OpenAI API key belum tersedia. Ini response dummy dari Alvira.",
        provider: "openai",
      };
    }

    try {
      const messages = request.messages ?? [
        {
          role: "system" as const,
          content:
            request.system || "You are Alvira AI, a helpful AI assistant.",
        },
        {
          role: "user" as const,
          content: request.prompt || "",
        },
      ];

      const completion = await this.client.chat.completions.create({
        model: request.model ?? env.OPENAI_MODEL ?? "gpt-4.1-mini",
        messages,
        temperature: request.temperature ?? 0.7,
        top_p: request.topP ?? 1,
        max_tokens: request.maxTokens ?? 2000,
      });

      return {
        content:
          completion.choices[0]?.message?.content || "Tidak ada response.",
        provider: "openai",
      };
    } catch (error) {
      console.error("OpenAI error:", error);

      return {
        content:
          "OpenAI quota belum tersedia. Ini response dummy sementara dari Alvira.",
        provider: "openai",
      };
    }
  }

  async stream(request: StreamAIRequest): Promise<GenerateAIResponse> {
    if (!this.client) {
      const dummy =
        "OpenAI API key belum tersedia. Ini response dummy streaming dari Alvira.";

      for (const word of dummy.split(" ")) {
        request.onChunk(word + " ");
        await new Promise((resolve) => setTimeout(resolve, 80));
      }

      return {
        content: dummy,
        provider: "openai",
      };
    }

    try {
      const messages = request.messages ?? [
        {
          role: "system" as const,
          content:
            request.system || "You are Alvira AI, a helpful AI assistant.",
        },
        {
          role: "user" as const,
          content: request.prompt || "",
        },
      ];

      const stream = await this.client.chat.completions.create({
        model: request.model ?? env.OPENAI_MODEL ?? "gpt-4.1-mini",
        messages,
        temperature: request.temperature ?? 0.7,
        top_p: request.topP ?? 1,
        max_tokens: request.maxTokens ?? 2000,
        stream: true,
      });

      let fullText = "";

      for await (const part of stream) {
        const chunk = part.choices[0]?.delta?.content || "";

        if (chunk) {
          fullText += chunk;
          request.onChunk(chunk);
        }
      }

      return {
        content: fullText,
        provider: "openai",
      };
    } catch (error) {
      console.error("OpenAI stream error:", error);

      const fallback =
        "OpenAI quota belum tersedia. Ini response dummy streaming sementara dari Alvira.";

      for (const word of fallback.split(" ")) {
        request.onChunk(word + " ");
        await new Promise((resolve) => setTimeout(resolve, 80));
      }

      return {
        content: fallback,
        provider: "openai",
      };
    }
  }
}
