import { useState } from "react";

import { aiToolsService } from "../services/ai-tools.service";
import type { AiTool } from "../types";

export function useAiTool(tool: AiTool) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const run = async (input: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await aiToolsService.run({
        tool,
        input,
      });

      setResult(response.result);

      return response.result;
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");

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
