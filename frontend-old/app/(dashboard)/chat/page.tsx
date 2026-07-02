"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Alvira AI 👋 How can I help you today?",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);
    const history = JSON.parse(localStorage.getItem("alvira-history") || "[]");

    history.unshift({
      id: Date.now(),
      question: userMessage,
      createdAt: new Date().toLocaleString(),
    });

    localStorage.setItem("alvira-history", JSON.stringify(history));

    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong.",
        },
      ]);

      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="flex h-screen flex-col bg-[#0B0F19] text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-8 py-5">
        <h1 className="text-2xl font-bold">Alvira AI Chat</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold">
                  AI
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl px-5 py-4 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-[#111827] text-slate-200"
                }`}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold">
                  U
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold">
                AI
              </div>

              <div className="rounded-2xl bg-[#111827] px-5 py-4 text-slate-300">
                Alvira is typing...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-6">
        <div className="mx-auto flex max-w-4xl gap-3">
          <input
            type="text"
            value={message}
            placeholder="Ask Alvira anything..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            className="flex-1 rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleSend}
            className="rounded-xl bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
