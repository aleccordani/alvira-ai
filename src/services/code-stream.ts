export async function streamCodeExplanation(
  language: string,
  code: string,
  onChunk: (chunk: string) => void,
) {

  const response = await fetch(
    "http://localhost:5000/api/tools/code/explain/stream",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        code,
      }),
    },
  );

  if (!response.body) {
    throw new Error("Streaming not supported.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      if (!event.startsWith("data:")) continue;

      const json = JSON.parse(event.replace("data:", "").trim());

      if (json.chunk) {
        onChunk(json.chunk);
      }
    }
  }
}
