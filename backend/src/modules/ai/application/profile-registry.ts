import { AIProfile } from "../domain/ai-profile.js";

import { GENERAL_PROMPT } from "../prompts/general.js";
import { DOC_SUMMARIZER_PROMPT } from "../prompts/docSummarizer.js";
import { NEURAL_CODE_STUDIO_PROMPT } from "../prompts/neuralCodeStudio.js";
import { LINGOFLOW_PROMPT } from "../prompts/lingoFlow.js";
import { WRITING_ASSISTANT_PROMPT } from "../prompts/writingAssistant.js";
import { IMAGE_PROMPTER_PROMPT } from "../prompts/imagePrompter.js";
import { BUSINESS_STRATEGY_PROMPT } from "../prompts/businessStrategy.js";
import { AiTool } from "../domain/ai-tool.js";

export const AI_PROFILES: Record<string, AIProfile> = {
  general: {
    tool: "general",
    model: "gpt-4.1-mini",
    prompt: GENERAL_PROMPT,
    temperature: 0.7,
    topP: 1,
    maxTokens: 2000,
  },

  "doc-summarizer": {
    tool: "doc-summarizer",
    model: "gpt-4.1-mini",
    prompt: DOC_SUMMARIZER_PROMPT,
    temperature: 0.2,
    topP: 1,
    maxTokens: 3000,
  },

  "neural-code-studio": {
    tool: "neural-code-studio",
    model: "gpt-4.1-mini",
    prompt: NEURAL_CODE_STUDIO_PROMPT,
    temperature: 0.15,
    topP: 1,
    maxTokens: 4000,
  },

  "lingoflow-translator": {
    tool: "lingoflow-translator",
    model: "gpt-4.1-mini",
    prompt: LINGOFLOW_PROMPT,
    temperature: 0.25,
    topP: 1,
    maxTokens: 2500,
  },

  "writing-assistant": {
    tool: "writing-assistant",
    model: "gpt-4.1-mini",
    prompt: WRITING_ASSISTANT_PROMPT,
    temperature: 0.9,
    topP: 1,
    maxTokens: 3000,
  },

  "image-prompter": {
    tool: "image-prompter",
    model: "gpt-4.1-mini",
    prompt: IMAGE_PROMPTER_PROMPT,
    temperature: 0.8,
    topP: 1,
    maxTokens: 2500,
  },

  "business-strategy-canvas": {
    tool: "business-strategy-canvas",
    model: "gpt-4.1-mini",
    prompt: BUSINESS_STRATEGY_PROMPT,
    temperature: 0.4,
    topP: 1,
    maxTokens: 3000,
  },
};

export function getAIProfile(tool: AiTool = "general") {
  return AI_PROFILES[tool] ?? AI_PROFILES.general;
}
