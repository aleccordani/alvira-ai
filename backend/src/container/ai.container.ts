import { AIService } from "../modules/ai/application/ai.service.js";
import { OpenAIProvider } from "../modules/ai/infrastructure/openai.provider.js";

const openAIProvider = new OpenAIProvider();

export const aiService = new AIService(openAIProvider);
