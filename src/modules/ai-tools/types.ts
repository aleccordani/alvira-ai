export type AiTool =
  | "cv-reviewer"
  | "code-explainer"
  | "email-writer"
  | "content-generator"
  | "business-idea-generator"
  | "summarizer"
  | "translator"
  | "business-analyzer"
  | "image-prompter";

export interface RunAiToolRequest {
  tool: AiTool;
  input: string;
}

export interface RunAiToolResponse {
  tool: AiTool;
  result: string;
}
