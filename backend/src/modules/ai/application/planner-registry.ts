import { AiTool } from "../domain/ai-tool.js";

import { GENERAL_PLANNER } from "../planners/general.js";
import { CODING_PLANNER } from "../planners/coding.js";
import { DOCUMENT_PLANNER } from "../planners/document.js";
import { TRANSLATION_PLANNER } from "../planners/translation.js";
import { WRITING_PLANNER } from "../planners/writing.js";
import { IMAGE_PLANNER } from "../planners/image.js";
import { BUSINESS_PLANNER } from "../planners/business.js";

export const PLANNER_REGISTRY: Record<AiTool, string> = {
  general: GENERAL_PLANNER,
  "neural-code-studio": CODING_PLANNER,
  "doc-summarizer": DOCUMENT_PLANNER,
  "lingoflow-translator": TRANSLATION_PLANNER,
  "writing-assistant": WRITING_PLANNER,
  "image-prompter": IMAGE_PLANNER,
  "business-strategy-canvas": BUSINESS_PLANNER,
};

export function getPlanner(tool: AiTool): string {
  return PLANNER_REGISTRY[tool];
}
