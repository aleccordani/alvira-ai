export type AiToolType =
  | "cv-reviewer"
  | "code-explainer"
  | "email-writer"
  | "content-generator"
  | "business-idea-generator"
  | "summarizer"
  | "translator";

export interface RunAiToolRequest {
  tool: AiToolType;
  input: string;
}

export interface RunAiToolResponse {
  tool: AiToolType;
  result: string;
}
