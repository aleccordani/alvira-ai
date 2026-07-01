import { ConversationRepository } from "../../conversation/domain/conversation.repository.js";
import { MessageRepository } from "../../message/domain/message.repository.js";
import { CreateUsageLogUseCase } from "../../usage/application/create-usage-log.usecase.js";
import { OpenAIService } from "../infrastructure/openai.service.js";

type StreamChatInput = {
  conversationId: string;
  content: string;
  onChunk: (chunk: string) => void;
};

export class StreamChatUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly openAIService: OpenAIService,
    private readonly createUsageLogUseCase: CreateUsageLogUseCase,
  ) {}

  async execute(data: StreamChatInput) {
    const conversation = await this.conversationRepository.findById(
      data.conversationId,
    );

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const userMessage = await this.messageRepository.create({
      conversationId: data.conversationId,
      role: "user",
      content: data.content,
    });

    const previousMessages = await this.messageRepository.findByConversationId(
      data.conversationId,
    );

    const limitedMessages = previousMessages.slice(-20);

    const assistantText = await this.openAIService.streamReply(
      [
        {
          role: "system",
          content:
            "You are Alvira AI, a smart AI assistant for business productivity.",
        },
        ...previousMessages.map((message) => ({
          role: message.role as "user" | "assistant" | "system",
          content: message.content,
        })),
      ],
      data.onChunk,
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

    return {
      conversation: updatedConversation,
      userMessage,
      assistantMessage,
    };
  }
}
