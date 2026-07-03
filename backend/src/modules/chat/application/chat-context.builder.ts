import { MessageEntity } from "../../message/domain/message.repository.js";
import { AIProfile } from "../../ai/domain/ai-profile.js";

export type ChatContextInput = {
  profile: AIProfile;
  memory: string;
  messages: MessageEntity[];
};

export class ChatContextBuilder {
  build(input: ChatContextInput) {
    return [
      {
        role: "system" as const,
        content: `${input.profile.prompt}

Conversation Memory:
${input.memory || "No memory yet."}`,
      },
      ...input.messages.map((message) => ({
        role: message.role as "user" | "assistant" | "system",
        content: message.content,
      })),
    ];
  }
}
