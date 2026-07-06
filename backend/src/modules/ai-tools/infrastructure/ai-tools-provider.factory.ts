import { MockAiToolsService } from "./mock-ai-tools.service.js";
import { OpenAiToolsService } from "./openai-ai-tools.service.js";

export function createAiToolsProvider() {
  if (process.env.AI_MOCK === "true") {
    return new MockAiToolsService();
  }

  return new OpenAiToolsService();
}
