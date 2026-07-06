import { MockAiToolsService } from "../infrastructure/mock-ai-tools.service.js";
import type { AiToolsProvider } from "./ai-tools.provider.js";
import type {
  RunAiToolRequest,
  RunAiToolResponse,
} from "../types/ai-tool.type.js";

export class RunAiToolUseCase {
  constructor(private readonly aiToolsService: AiToolsProvider) {}

  async execute(request: RunAiToolRequest): Promise<RunAiToolResponse> {
    return this.aiToolsService.run(request.tool, request.input);
  }
}
