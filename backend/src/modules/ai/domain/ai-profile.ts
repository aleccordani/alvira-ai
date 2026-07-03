import { AiTool } from "./ai-tool.js";

export interface AIProfile {
  tool: AiTool;

  model: string;

  prompt: string;

  temperature: number;

  topP: number;

  maxTokens: number;
}
