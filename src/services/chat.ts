const API_URL = "http://localhost:5000/api";

export type AiTool =
  | "general"
  | "neural-code-studio"
  | "doc-summarizer"
  | "lingoflow-translator"
  | "writing-assistant"
  | "image-prompter"
  | "business-strategy-canvas";

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
    body: JSON.stringify({ conversationId, content, tool }),
  });

  if (!response.ok) throw new Error("Failed to send chat");

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
    body: JSON.stringify({ conversationId, content, tool }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to stream chat");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const line = event.trim();

      if (!line.startsWith("data:")) continue;

      const jsonText = line.replace(/^data:\s*/, "");

      try {
        const parsed = JSON.parse(jsonText);

        if (parsed.done) return fullText;

        if (parsed.chunk) {
          fullText += parsed.chunk;
          onChunk(parsed.chunk);
        }
      } catch {
        // skip incomplete SSE event
      }
    }
  }

  return fullText;
};
