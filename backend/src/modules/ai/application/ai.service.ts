import { AIProvider } from "../domain/ai-provider.js";
import {
  GenerateAIRequest,
  GenerateAIResponse,
  StreamAIRequest,
} from "../domain/ai.types.js";

export class AIService {
  constructor(private readonly provider: AIProvider) {}

  async generate(request: GenerateAIRequest): Promise<GenerateAIResponse> {
    return this.provider.generate(request);
  }

  async stream(request: StreamAIRequest): Promise<GenerateAIResponse> {
    return this.provider.stream(request);
  }

  generateTitle(content: string): string {
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
