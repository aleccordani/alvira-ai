import { CheckCreditsUseCase } from "../../usage/application/check-credits.usecase.js";
import { CreateUsageLogUseCase } from "../../usage/application/create-usage-log.usecase.js";
import { AIProvider } from "../../ai/domain/ai-provider.js";
import { PromptBuilderService } from "../infrastructure/prompt-builder.service.js";
import { SearchWorkspaceUseCase } from "./search-workspace.usecase.js";

export interface AskWorkspaceRequest {
  userId: string;
  workspaceId: string;
  question: string;
}

const WORKSPACE_AI_CREDIT_COST = 100;

export class AskWorkspaceUseCase {
  constructor(
    private readonly searchWorkspace: SearchWorkspaceUseCase,
    private readonly promptBuilder: PromptBuilderService,
    private readonly aiProvider: AIProvider,
    private readonly checkCreditsUseCase: CheckCreditsUseCase,
    private readonly createUsageLogUseCase: CreateUsageLogUseCase,
  ) {}

  async execute(request: AskWorkspaceRequest): Promise<string> {
    await this.checkCreditsUseCase.execute(
      request.userId,
      WORKSPACE_AI_CREDIT_COST,
    );

    const results = await this.searchWorkspace.execute({
      workspaceId: request.workspaceId,
      question: request.question,
    });

    const prompt = this.promptBuilder.build(
      request.question,
      results.map((result) => result.chunk.content),
    );

    const response = await this.aiProvider.generate({
      prompt,
    });

    await this.createUsageLogUseCase.execute({
      userId: request.userId,
      model: "workspace-ai",
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: WORKSPACE_AI_CREDIT_COST,
      creditsToConsume: WORKSPACE_AI_CREDIT_COST,
      cost: 0,
    });

    return response.content;
  }
}
