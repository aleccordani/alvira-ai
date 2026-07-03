export type AiTool =
  | "general"
  | "doc-summarizer"
  | "neural-code-studio"
  | "lingoflow-translator"
  | "writing-assistant"
  | "image-prompter"
  | "business-strategy-canvas";

export interface AiContext {
  tool: AiTool;
}
