import { OpenAIService } from "../infrastructure/openai.service.js";
import { ChatContextBuilder } from "./chat-context.builder.js";
import { AIProfile } from "../../ai/domain/ai-profile.js";
import { MessageEntity } from "../../message/domain/message.repository.js";

type GenerateInput = {
  profile: AIProfile;
  memory: string;
  messages: MessageEntity[];
};

export class ChatEngine {
  constructor(
    private readonly contextBuilder: ChatContextBuilder,
    private readonly openAIService: OpenAIService,
  ) {}

  async generate(input: GenerateInput) {
    const context = this.contextBuilder.build({
      profile: input.profile,
      memory: input.memory,
      messages: input.messages,
    });

    return this.openAIService.generateReply(context, input.profile);
  }

  async stream(input: GenerateInput, onChunk: (chunk: string) => void) {
    const context = this.contextBuilder.build({
      profile: input.profile,
      memory: input.memory,
      messages: input.messages,
    });

    return this.openAIService.streamReply(context, onChunk, input.profile);
  }
}
