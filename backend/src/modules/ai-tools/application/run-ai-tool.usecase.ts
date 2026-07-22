import { CheckCreditsUseCase } from "../../usage/application/check-credits.usecase.js";
import { CreateUsageLogUseCase } from "../../usage/application/create-usage-log.usecase.js";
import type {
  RunAiToolRequest,
  RunAiToolResponse,
} from "../types/ai-tool.type.js";
import type { AiToolsProvider } from "./ai-tools.provider.js";

const getToolCreditCost = (tool: RunAiToolRequest["tool"]) => {
  switch (tool) {
    case "code-explainer":
    case "summarizer":
    case "business-analyzer":
      return 100;

    case "translator":
    case "image-prompter":
    case "email-writer":
    case "content-generator":
    case "business-idea-generator":
    case "cv-reviewer":
    default:
      return 50;
  }
};

export class RunAiToolUseCase {
  constructor(
    private readonly aiToolsService: AiToolsProvider,
    private readonly checkCreditsUseCase: CheckCreditsUseCase,
    private readonly createUsageLogUseCase: CreateUsageLogUseCase,
  ) {}

  async execute(
    userId: string,
    request: RunAiToolRequest,
  ): Promise<RunAiToolResponse> {
    const creditsToConsume = getToolCreditCost(request.tool);

    // Cek sebelum provider AI dipanggil.
    await this.checkCreditsUseCase.execute(userId, creditsToConsume);

    const result = await this.aiToolsService.run(request.tool, request.input);

    // Potong kredit dan simpan log setelah proses berhasil.
    await this.createUsageLogUseCase.execute({
      userId,
      model: `ai-tool:${request.tool}`,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: creditsToConsume,
      creditsToConsume,
      cost: 0,
    });

    return result;
  }
}
