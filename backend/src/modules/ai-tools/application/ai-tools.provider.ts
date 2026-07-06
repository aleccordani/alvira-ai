import type { AiToolType, RunAiToolResponse } from "../types/ai-tool.type.js";

export interface AiToolsProvider {
  run(tool: AiToolType, input: string): Promise<RunAiToolResponse>;
}
