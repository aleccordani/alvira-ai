import { AiTool } from "../domain/ai-tool.js";
import { GENERAL_PROMPT } from "../prompts/general.js";
import { DOC_SUMMARIZER_PROMPT } from "../prompts/docSummarizer.js";
import { NEURAL_CODE_STUDIO_PROMPT } from "../prompts/neuralCodeStudio.js";
import { LINGOFLOW_PROMPT } from "../prompts/lingoFlow.js";
import { WRITING_ASSISTANT_PROMPT } from "../prompts/writingAssistant.js";
import { IMAGE_PROMPTER_PROMPT } from "../prompts/imagePrompter.js";
import { BUSINESS_STRATEGY_PROMPT } from "../prompts/businessStrategy.js";
import { GenerateAIRequest } from "../domain/ai.types.js";

const promptRegistry: Record<AiTool, string> = {
  general: GENERAL_PROMPT,
  "doc-summarizer": DOC_SUMMARIZER_PROMPT,
  "neural-code-studio": NEURAL_CODE_STUDIO_PROMPT,
  "lingoflow-translator": LINGOFLOW_PROMPT,
  "writing-assistant": WRITING_ASSISTANT_PROMPT,
  "image-prompter": IMAGE_PROMPTER_PROMPT,
  "business-strategy-canvas": BUSINESS_STRATEGY_PROMPT,
};

export const getSystemPrompt = (tool: AiTool = "general") => {
  return promptRegistry[tool] ?? GENERAL_PROMPT;
};

export function codeExplainPrompt(
  language: string,
  code: string,
): GenerateAIRequest {
  return {
    system:
      "You are Alvira Neural Code Studio, a senior software engineer that explains code clearly and professionally. Always return valid JSON only.",
    prompt: `
Explain this ${language} code.

Return ONLY valid JSON with this structure:
{
  "summary": "short summary",
  "explanation": [
    {
      "title": "section title",
      "content": "section explanation"
    }
  ],
  "complexity": "time/space complexity if applicable",
  "bestPractices": ["best practice 1"],
  "suggestions": ["suggestion 1"]
}

Code:
${code}
`,
    temperature: 0.3,
    maxTokens: 1200,
  };
}
