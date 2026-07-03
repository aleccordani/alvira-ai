import { AIService } from "../../../ai/application/ai.service.js";
import { codeExplainPrompt } from "../../../ai/application/prompt-registry.js";
import { ExplainCodeInput, ExplainCodeResult } from "../domain/code.types.js";

export class ExplainCodeUseCase {
  constructor(private readonly aiService: AIService) {}

  async execute(input: ExplainCodeInput): Promise<ExplainCodeResult> {
    const response = await this.aiService.generate(
      codeExplainPrompt(input.language, input.code),
    );

    try {
      return JSON.parse(response.content) as ExplainCodeResult;
    } catch {
      return {
        summary:
          "This is a fallback explanation because the AI provider is currently unavailable.",
        explanation: [
          {
            title: "Code Overview",
            content:
              "The submitted code will be analyzed here once the AI provider is available.",
          },
        ],
        complexity: "Not available in fallback mode.",
        bestPractices: [
          "Keep code readable.",
          "Use meaningful naming.",
          "Handle errors properly.",
        ],
        suggestions: ["Try again after the AI quota or billing is available."],
      };
    }
  }
}
