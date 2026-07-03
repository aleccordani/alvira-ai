import {
  GenerateAIRequest,
  GenerateAIResponse,
  StreamAIRequest,
} from "./ai.types.js";

export interface AIProvider {
  generate(request: GenerateAIRequest): Promise<GenerateAIResponse>;
  stream(request: StreamAIRequest): Promise<GenerateAIResponse>;
}
