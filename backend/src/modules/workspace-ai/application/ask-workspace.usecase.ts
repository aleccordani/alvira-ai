import { SearchWorkspaceUseCase } from "./search-workspace.usecase.js";
import { PromptBuilderService } from "../infrastructure/prompt-builder.service.js";
import { AIProvider } from "../../ai/domain/ai-provider.js";

export interface AskWorkspaceRequest {
  workspaceId: string;
  question: string;
}

export class AskWorkspaceUseCase {
  constructor(
    private readonly searchWorkspace: SearchWorkspaceUseCase,
    private readonly promptBuilder: PromptBuilderService,
    private readonly aiProvider: AIProvider,
  ) {}

  async execute(request: AskWorkspaceRequest): Promise<string> {
    const results = await this.searchWorkspace.execute({
      workspaceId: request.workspaceId,
      question: request.question,
    });

    const prompt = this.promptBuilder.build(
      request.question,
      results.map((r) => r.chunk.content),
    );

    const response = await this.aiProvider.generate({
      prompt,
    });

    return response.content;
  }
}
