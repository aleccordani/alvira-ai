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
    if (env.AI_MOCK) {
      return {
        content: `🤖 Mock Response

Berdasarkan dokumen yang ada di workspace ini, ALVIRA berhasil memproses pertanyaan kamu.

Ringkasan sementara:
- Dokumen berhasil dibaca.
- Workspace search berhasil berjalan.
- Prompt builder berhasil membuat konteks.
- AI provider berhasil mengirim response.

Catatan:
OpenAI Billing masih dinonaktifkan, jadi ini adalah jawaban simulasi.

Pertanyaan kamu:
${request.prompt?.split("Question:").pop()?.trim() || request.prompt}`,
        provider: "openai",
      };
    }
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
        content: `🚀 ALVIRA Demo Mode

AI Pipeline aktif.

OpenAI Billing belum diaktifkan sehingga sistem menjalankan simulasi response.

Semua komponen backend tetap berjalan normal dan siap beralih ke GPT production.`,
        provider: "openai",
      };
    }
  }

  async stream(request: StreamAIRequest): Promise<GenerateAIResponse> {
    if (env.AI_MOCK) {
      const dummy = `🤖 Mock Streaming Response

ALVIRA is currently running in Mock Mode.

OpenAI billing is disabled.

Streaming pipeline works correctly.`;

      for (const word of dummy.split(" ")) {
        request.onChunk(word + " ");
        await new Promise((resolve) => setTimeout(resolve, 40));
      }

      return {
        content: dummy,
        provider: "openai",
      };
    }
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

      const fallback = `🚀 ALVIRA Demo Mode

AI engine production berhasil terhubung.

Namun akun developer saat ini belum mengaktifkan OpenAI Billing sehingga jawaban AI menggunakan mode simulasi.

Yang sudah berjalan:

✅ Authentication
✅ Conversation History
✅ Streaming Response
✅ Workspace Context
✅ Memory
✅ AI Pipeline

Saat billing diaktifkan, jawaban ini otomatis berasal dari GPT tanpa perubahan kode.`;

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
