import { Workspace } from "../domain/workspace.js";
import { AiTool } from "../domain/ai-tool.js";

export const WORKSPACE_MAP: Record<AiTool, Workspace> = {
  general: "chat",
  "neural-code-studio": "coding",
  "doc-summarizer": "document",
  "lingoflow-translator": "translation",
  "writing-assistant": "writing",
  "image-prompter": "image",
  "business-strategy-canvas": "business",
};

export function getWorkspace(tool: AiTool): Workspace {
  return WORKSPACE_MAP[tool];
}
