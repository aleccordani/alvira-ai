import { frontendEnv } from "../lib/env";

const API_URL = `${frontendEnv.API_BASE_URL}/api`;

export type AiTool =
  | "general"
  | "neural-code-studio"
  | "doc-summarizer"
  | "lingoflow-translator"
  | "writing-assistant"
  | "image-prompter"
  | "business-strategy-canvas";

type ApiErrorPayload = {
  success?: boolean;
  code?: string;
  message?: string;
};

export class ChatApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ChatApiError";
    this.status = status;
    this.code = code;
  }
}

async function createChatApiError(response: Response): Promise<ChatApiError> {
  let payload: ApiErrorPayload = {};

  try {
    payload = (await response.json()) as ApiErrorPayload;
  } catch {
    // Response mungkin bukan JSON.
  }

  return new ChatApiError(
    response.status,
    payload.message || `Chat request failed with status ${response.status}`,
    payload.code,
  );
}

export const sendChat = async (
  conversationId: string,
  content: string,
  tool: AiTool = "general",
) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversationId,
      content,
      tool,
    }),
  });

  if (!response.ok) {
    throw await createChatApiError(response);
  }

  return response.json();
};

export const streamChat = async (
  conversationId: string,
  content: string,
  onChunk: (chunk: string) => void,
  tool: AiTool = "general",
) => {
  const response = await fetch(`${API_URL}/chat/stream`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversationId,
      content,
      tool,
    }),
  });

  if (!response.ok) {
    throw await createChatApiError(response);
  }

  if (!response.body) {
    throw new ChatApiError(
      response.status,
      "Streaming response body is unavailable.",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      buffer += decoder.decode();
      break;
    }

    buffer += decoder.decode(value, {
      stream: true,
    });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const dataLines = event
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.replace(/^data:\s*/, ""));

      if (dataLines.length === 0) continue;

      const jsonText = dataLines.join("\n");

      try {
        const parsed = JSON.parse(jsonText);

        if (parsed.error) {
          throw new ChatApiError(
            parsed.status ?? 500,
            parsed.message ?? "Streaming failed.",
            parsed.code,
          );
        }

        if (parsed.done) {
          return fullText;
        }

        if (typeof parsed.chunk === "string") {
          fullText += parsed.chunk;
          onChunk(parsed.chunk);
        }
      } catch (error) {
        if (error instanceof ChatApiError) {
          throw error;
        }

        console.warn("Invalid SSE event ignored:", jsonText);
      }
    }
  }

  return fullText;
};
