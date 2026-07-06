import type { AiToolsProvider } from "../application/ai-tools.provider.js";
import type { AiToolType, RunAiToolResponse } from "../types/ai-tool.type.js";

export class OpenAiToolsService implements AiToolsProvider {
  async run(tool: AiToolType, input: string): Promise<RunAiToolResponse> {
    throw new Error("OpenAI provider is not implemented yet.");
  }
}
