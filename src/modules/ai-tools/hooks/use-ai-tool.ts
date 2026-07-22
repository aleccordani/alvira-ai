import { useState } from "react";

import { aiToolsService } from "../services/ai-tools.service";
import type { AiTool } from "../types";

type AiToolApiResponse = {
  result?: string;
  data?: {
    result?: string;
  };
};

export function useAiTool(tool: AiTool) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const run = async (input: string) => {
    setLoading(true);
    setError("");

    try {
      const response = (await aiToolsService.run({
        tool,
        input,
      })) as AiToolApiResponse;

      const generatedResult = response.data?.result ?? response.result ?? "";

      if (!generatedResult) {
        throw new Error("AI tool returned an empty result.");
      }

      setResult(generatedResult);

      return generatedResult;
    } catch (err) {
      console.error("RUN AI TOOL ERROR:", err);

      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    run,
    loading,
    result,
    error,
    setResult,
  };
}
