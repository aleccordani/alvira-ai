import { AIService } from "../../ai/application/ai.service.js";
import { getAIProfile } from "../../ai/application/profile-registry.js";
import { AiTool } from "../../ai/domain/ai-tool.js";
import { ConversationRepository } from "../../conversation/domain/conversation.repository.js";
import { MemoryService } from "../../memory/application/memory.service.js";
import { MessageRepository } from "../../message/domain/message.repository.js";
import { CheckCreditsUseCase } from "../../usage/application/check-credits.usecase.js";
import { CreateUsageLogUseCase } from "../../usage/application/create-usage-log.usecase.js";

type SendChatInput = {
  conversationId: string;
  content: string;
  tool: AiTool;
};

const CHAT_CREDIT_COST = 100;

export class SendChatUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly aiService: AIService,
    private readonly createUsageLogUseCase: CreateUsageLogUseCase,
    private readonly memoryService: MemoryService,
    private readonly checkCreditsUseCase: CheckCreditsUseCase,
  ) {}

  async execute(data: SendChatInput) {
    const conversation = await this.conversationRepository.findById(
      data.conversationId,
    );

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Wajib sebelum menyimpan pesan atau memanggil AI.
    await this.checkCreditsUseCase.execute(
      conversation.userId,
      CHAT_CREDIT_COST,
    );

    const summary = await this.memoryService.getSummary(data.conversationId);

    const userMessage = await this.messageRepository.create({
      conversationId: data.conversationId,
      role: "user",
      content: data.content,
    });

    const previousMessages = await this.messageRepository.findByConversationId(
      data.conversationId,
    );

    const limitedMessages = previousMessages.slice(-20);
    const aiProfile = getAIProfile(data.tool);

    const response = await this.aiService.generate({
      messages: [
        {
          role: "system",
          content: `${aiProfile.prompt}

Conversation Memory:
${summary || "No memory yet."}`,
        },
        ...limitedMessages.map((message) => ({
          role: message.role as "user" | "assistant" | "system",
          content: message.content,
        })),
      ],
      model: aiProfile.model,
      temperature: aiProfile.temperature,
      topP: aiProfile.topP,
      maxTokens: aiProfile.maxTokens,
    });

    const assistantMessage = await this.messageRepository.create({
      conversationId: data.conversationId,
      role: "assistant",
      content: response.content,
    });

    await this.createUsageLogUseCase.execute({
      userId: conversation.userId,
      conversationId: conversation.id,
      model: aiProfile.model,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: CHAT_CREDIT_COST,
      creditsToConsume: CHAT_CREDIT_COST,
      cost: 0,
    });

    let updatedConversation = conversation;

    const shouldAutoRename =
      !conversation.title ||
      conversation.title === "New Chat" ||
      conversation.title === "terbaru";

    if (shouldAutoRename) {
      const title = this.aiService.generateTitle(data.content);

      updatedConversation = await this.conversationRepository.update({
        id: conversation.id,
        title,
      });
    }

    await this.memoryService.saveSummary(data.conversationId, data.content);

    return {
      conversation: updatedConversation,
      userMessage,
      assistantMessage,
    };
  }
}
