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
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-purple-950/20 bg-[#16171f]">
      <div className="border-b border-purple-950/20 px-5 py-4">
        <h2 className="font-bold text-white">
          {workspace ? workspace.name : "Workspace Chat"}
        </h2>
        <p className="text-sm text-[#8b8e99]">
          Ask AI based on uploaded documents.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {!workspace && (
          <div className="flex h-full items-center justify-center text-sm text-[#8b8e99]">
            Select or create a workspace first.
          </div>
        )}

        {workspace && messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-[#8b8e99]">
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
                  ? "bg-purple-600 text-white"
                  : "border border-purple-950/20 bg-[#101117] text-[#c5c6c7]"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-purple-950/20 bg-[#101117] px-4 py-3 text-sm text-[#8b8e99]">
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

      <div className="border-t border-purple-950/20 p-4">
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
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-xl border border-purple-950/25 bg-[#101117] px-4 py-3 text-sm text-[#c5c6c7] outline-none placeholder:text-[#555866] focus:border-purple-500"
          />

          <button
            disabled={!workspace || !question.trim() || loading}
            onClick={handleAsk}
            className="h-12 rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
