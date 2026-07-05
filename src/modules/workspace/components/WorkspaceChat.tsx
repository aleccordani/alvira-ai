import { useEffect, useRef, useState } from "react";
import type { Workspace } from "../types";
import { workspaceService } from "../services/workspace.service";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  workspace: Workspace | null;
};

export default function WorkspaceChat({ workspace }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async () => {
    if (!workspace || !question.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: question.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const result = await workspaceService.askWorkspace(
        workspace.id,
        userMessage.content,
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, failed to ask workspace AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl border bg-white">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">
          {workspace ? workspace.name : "Workspace Chat"}
        </h2>
        <p className="text-sm text-gray-500">
          Ask AI based on uploaded documents.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {!workspace && (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select or create a workspace first.
          </div>
        )}

        {workspace && messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-gray-500">
            Ask questions about "{workspace.name}".
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-150">●</span>
                <span className="animate-bounce delay-300">●</span>
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={question}
            disabled={!workspace || loading}
            rows={1}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder={
              workspace
                ? "Ask about your uploaded documents..."
                : "Select workspace first"
            }
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-500"
          />

          <button
            disabled={!workspace || !question.trim() || loading}
            onClick={handleAsk}
            className="h-12 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
