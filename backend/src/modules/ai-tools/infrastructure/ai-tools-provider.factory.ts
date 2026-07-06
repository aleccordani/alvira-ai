import { MockAiToolsService } from "./mock-ai-tools.service.js";
import { OpenAiToolsService } from "./openai-ai-tools.service.js";

export function createAiToolsProvider() {
  const isMockMode = process.env.AI_MOCK === "true";
  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY);

  if (!isMockMode && hasOpenAiKey) {
    return new OpenAiToolsService();
  }
  return new MockAiToolsService();
}
