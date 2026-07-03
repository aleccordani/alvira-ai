import { ConversationRepository } from "../../conversation/domain/conversation.repository.js";
import { MessageRepository } from "../../message/domain/message.repository.js";
import { CreateUsageLogUseCase } from "../../usage/application/create-usage-log.usecase.js";
import { OpenAIService } from "../infrastructure/openai.service.js";
import { getAIProfile } from "../../ai/application/profile-registry.js";
import { AiTool } from "../../ai/domain/ai-tool.js";
import { MemoryService } from "../../memory/application/memory.service.js";

type StreamChatInput = {
  conversationId: string;
  content: string;
  tool: AiTool;
  onChunk: (chunk: string) => void;
};

export class StreamChatUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly openAIService: OpenAIService,
    private readonly createUsageLogUseCase: CreateUsageLogUseCase,
    private readonly memoryService: MemoryService,
  ) {}

  async execute(data: StreamChatInput) {
    const conversation = await this.conversationRepository.findById(
      data.conversationId,
    );

    if (!conversation) {
      throw new Error("Conversation not found");
    }
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

    const assistantText = await this.openAIService.streamReply(
      [
        {
          role: "system",
          content: `${aiProfile.prompt}

Conversation Memory:
${summary || "No memory yet."}`,
        },
        ...previousMessages.map((message) => ({
          role: message.role as "user" | "assistant" | "system",
          content: message.content,
        })),
      ],
      data.onChunk,
      aiProfile,
    );

    const assistantMessage = await this.messageRepository.create({
      conversationId: data.conversationId,
      role: "assistant",
      content: assistantText,
    });

    await this.createUsageLogUseCase.execute({
      userId: conversation.userId,
      conversationId: conversation.id,
      model: "gpt-4.1-mini",
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      cost: 0,
    });

    let updatedConversation = conversation;

    if (conversation.title === "New Chat") {
      const title = await this.openAIService.generateTitle(data.content);

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
