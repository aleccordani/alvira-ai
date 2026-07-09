import OpenAI from "openai";

import type { AiToolsProvider } from "../application/ai-tools.provider.js";
import type { AiToolType, RunAiToolResponse } from "../types/ai-tool.type.js";

export class OpenAiToolsService implements AiToolsProvider {
  private readonly client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async run(tool: AiToolType, input: string): Promise<RunAiToolResponse> {
    const response = await this.client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: this.buildPrompt(tool, input),
    });

    return {
      tool,
      result: response.output_text,
    };
  }

  private buildPrompt(tool: AiToolType, input: string): string {
    const base = `You are ALVIRA, a professional AI SaaS assistant. Give a useful, structured, production-quality answer.`;

    const prompts: Record<AiToolType, string> = {
      "cv-reviewer": `${base}\n\nReview this CV/profile and provide strengths, weaknesses, improvements, and a better professional summary:\n\n${input}`,

      "code-explainer": `${base}\n\nAnalyze this code. Explain what it does, detect issues, suggest improvements, and include complexity if possible:\n\n${input}`,

      "email-writer": `${base}\n\nWrite a professional email based on this request:\n\n${input}`,

      "content-generator": `${base}\n\nGenerate polished content based on this request:\n\n${input}`,

      "business-idea-generator": `${base}\n\nGenerate and evaluate a business idea from this input:\n\n${input}`,

      summarizer: `${base}\n\nSummarize this content clearly with key points:\n\n${input}`,

      translator: `${base}\n\nTranslate the following text while preserving tone and context:\n\n${input}`,

      "business-analyzer": `${base}\n\nAnalyze this business idea. Include market potential, strengths, weaknesses, target customers, revenue streams, and recommendation:\n\n${input}`,

      "image-prompter": `
You are an expert AI image prompt engineer.
Create a detailed, high-quality image generation prompt based on the user's request.
Return only the final prompt.
`,
    };

    return prompts[tool];
  }
}
