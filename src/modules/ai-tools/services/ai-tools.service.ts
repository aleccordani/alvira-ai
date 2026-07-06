import { api } from "../../../lib/api";

import type { RunAiToolRequest, RunAiToolResponse } from "../types";

export const aiToolsService = {
  async run(payload: RunAiToolRequest): Promise<RunAiToolResponse> {
    const { data } = await api.post("/ai-tools/run", payload);

    return data;
  },
};
