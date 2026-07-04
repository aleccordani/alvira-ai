import { AIService } from "../../../ai/application/ai.service.js";
import { codeExplainPrompt } from "../../../ai/application/prompt-registry.js";

type ExplainCodeStreamInput = {
  language: string;
  code: string;
  onChunk: (chunk: string) => void;
};

export class ExplainCodeStreamUseCase {
  constructor(private readonly aiService: AIService) {}

  async execute(input: ExplainCodeStreamInput) {
    const prompt = codeExplainPrompt(input.language, input.code);

    return this.aiService.stream({
      ...prompt,
      onChunk: input.onChunk,
    });
  }
}
