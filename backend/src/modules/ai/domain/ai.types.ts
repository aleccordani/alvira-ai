export type AIProviderName = "openai";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface GenerateAIRequest {
  system?: string;
  prompt?: string;
  messages?: AIMessage[];
  model?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}

export interface GenerateAIResponse {
  content: string;
  provider: AIProviderName;
}

export interface StreamAIRequest extends GenerateAIRequest {
  onChunk: (chunk: string) => void;
}
