import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Image,
  Mic,
  Sparkles,
  Bot,
  User,
  X,
  PlusCircle,
  Copy,
  Check,
  AlertCircle,
  Clock,
} from "lucide-react";
import { ChatMessage, ChatSession, UserProfile } from "../types";

interface ChatTabProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeSession: ChatSession | null;
  onUpdateSessionMessages: (sessionId: string, messages: ChatMessage[]) => void;
  preFilledPrompt: string;
  clearPreFilledPrompt: () => void;
}

// Polished, self-contained Markdown and code-block formatter to avoid node-module build friction
function RenderMarkdown({ text }: { text: string }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!text) return null;

  // Split content by triple-backtick code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-[#c5c6c7] break-words">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          // Extract language and actual code content
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "";
          const code = match ? match[2] : part.slice(3, -3);
          const blockId = `code-${index}`;

          return (
            <div key={index} className="rounded-xl overflow-hidden border border-purple-950/30 bg-[#0a0a0f] my-3">
              <div className="bg-[#121218] px-4 py-2 flex justify-between items-center border-b border-purple-950/25">
                <span className="text-[10px] font-mono text-[#8b8e99] uppercase tracking-wider">
                  {lang || "code"}
                </span>
                <button
                  onClick={() => copyToClipboard(code, blockId)}
                  className="p-1 text-[#8b8e99] hover:text-white hover:bg-purple-950/10 rounded transition-all flex items-center gap-1 text-[10px] font-semibold"
                >
                  {copiedId === blockId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono text-[#dcdce0] leading-normal scrollbar-thin">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Handle inline markdown rendering: headers, lists, bold text, inline code
        const lines = part.split("\n");
        return (
          <div key={index} className="space-y-2">
            {lines.map((line, lIdx) => {
              // Heading 3
              if (line.startsWith("### ")) {
                return (
                  <h4 key={lIdx} className="text-base font-bold text-white pt-2">
                    {line.slice(4)}
                  </h4>
                );
              }
              // Heading 2
              if (line.startsWith("## ")) {
                return (
                  <h3 key={lIdx} className="text-lg font-bold text-white pt-3 border-b border-purple-950/10 pb-1">
                    {line.slice(3)}
                  </h3>
                );
              }
              // Bullet lists
              if (line.startsWith("* ") || line.startsWith("- ")) {
                return (
                  <ul key={lIdx} className="list-disc pl-5 space-y-1 my-1">
                    <li className="text-sm">
                      {parseInlineMarkdown(line.slice(2))}
                    </li>
                  </ul>
                );
              }
              // Ordered lists
              if (/^\d+\.\s/.test(line)) {
                const match = line.match(/^(\d+)\.\s(.*)/);
                return (
                  <ol key={lIdx} className="list-decimal pl-5 space-y-1 my-1">
                    <li className="text-sm">
                      {parseInlineMarkdown(match ? match[2] : line)}
                    </li>
                  </ol>
                );
              }
              // Empty spacer line
              if (line.trim() === "") {
                return <div key={lIdx} className="h-2"></div>;
              }

              return (
                <p key={lIdx} className="text-sm">
                  {parseInlineMarkdown(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Parse inline formatting: **bold** and `code`
function parseInlineMarkdown(text: string) {
  if (!text) return "";

  // Split by inline code blocks `code`
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="px-1.5 py-0.5 bg-purple-950/20 border border-purple-500/20 text-[#a78bfa] rounded text-xs font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Parse bold tags **bold** within normal segment
    const subParts = part.split(/(\*\*[^*]+\*\*)/g);
    return subParts.map((subPart, sIdx) => {
      if (subPart.startsWith("**") && subPart.endsWith("**")) {
        return (
          <strong key={sIdx} className="text-white font-bold">
            {subPart.slice(2, -2)}
          </strong>
        );
      }
      return subPart;
    });
  });
}

export default function ChatTab({
  user,
  setUser,
  activeSession,
  onUpdateSessionMessages,
  preFilledPrompt,
  clearPreFilledPrompt,
}: ChatTabProps) {
  const [modelMode, setModelMode] = useState<"Alvira-Pro" | "Alvira-1">("Alvira-Pro");
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{ mimeType: string; data: string } | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger pre-filled prompt if injected from Dashboard or Tools
  useEffect(() => {
    if (preFilledPrompt) {
      setInputVal(preFilledPrompt);
      clearPreFilledPrompt();
    }
  }, [preFilledPrompt, clearPreFilledPrompt]);

  // Autoscroll chat history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = (event.target.result as string).split(",")[1];
        setAttachedImage({
          mimeType: file.type,
          data: base64String,
        });
        setAttachedFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachedImage(null);
    setAttachedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (messageText = inputVal) => {
    if (!messageText.trim() && !attachedImage) return;
    if (!activeSession) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (attachedImage) {
      userMessage.image = `data:${attachedImage.mimeType};base64,${attachedImage.data}`;
    }

    const updatedMessages = [...activeSession.messages, userMessage];
    onUpdateSessionMessages(activeSession.id, updatedMessages);
    setInputVal("");
    removeAttachment();
    setLoading(true);

    try {
      // Map React messages into API history format
      const historyPayload = activeSession.messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          history: historyPayload,
          image: attachedImage,
        }),
      });

      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: "model",
        text: data.text || "I was unable to synthesize a clean reply. Please verify model state.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        simulated: data.simulated || false,
      };

      onUpdateSessionMessages(activeSession.id, [...updatedMessages, aiMessage]);

      // Dynamically consume tokens
      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + (data.simulated ? 100 : 1200), prev.tokensLimit),
      }));
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: "model",
        text: "Error connecting to the Alvira security node on port 3000. Running in Simulated Local Sandbox mode. Please check server logs.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        simulated: true,
      };
      onUpdateSessionMessages(activeSession.id, [...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { label: "Refactor Code", desc: "Refactor scripts to TypeScript", prompt: "Explain how to refactor an Express.js Node.js server into bundled TypeScript using tsx and esbuild" },
    { label: "Design Review", desc: "Examine mockup specifications", prompt: "Conduct a comprehensive accessibility and aesthetic design audit of a modern dark-themed SaaS interface" },
    { label: "Analyze Data", desc: "Formulate metrics from CSV logs", prompt: "Act as a data analyst. Formulate a step-by-step strategy to parse CSV telemetry logs and measure user drop-offs" },
    { label: "Creative Writing", desc: "Write high-converting copy", prompt: "Write an elegant, punchy product copy description for a new AI workspace tool named 'Alvira Flow Studio'" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0b0c10] text-[#c5c6c7] font-sans h-screen select-none" id="chat-tab">
      {/* Workstation Header */}
      <div className="p-4 border-b border-purple-950/25 flex items-center justify-between bg-[#0d0e14]/75 shrink-0">
        {/* Model Switch Toggle */}
        <div className="flex items-center bg-[#16171f] rounded-xl p-1 border border-purple-950/30">
          <button
            onClick={() => {
              setModelMode("Alvira-Pro");
              if (activeSession) activeSession.model = "Alvira-Pro";
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              modelMode === "Alvira-Pro"
                ? "bg-purple-600 text-white shadow"
                : "text-[#8b8e99] hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Alvira-Pro
          </button>
          <button
            onClick={() => {
              setModelMode("Alvira-1");
              if (activeSession) activeSession.model = "Alvira-1";
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              modelMode === "Alvira-1"
                ? "bg-purple-600 text-white shadow"
                : "text-[#8b8e99] hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> Alvira-1
          </button>
        </div>

        {/* Dynamic Token Credits gauge */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-purple-950/20 border border-purple-500/10 rounded-xl text-xs font-mono text-purple-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span>{((user.tokensLimit - user.tokensUsed) / 1000).toFixed(0)}k Available Credits</span>
          </div>
        </div>
      </div>

      {/* Messages Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!activeSession || activeSession.messages.length === 0 ? (
          /* Empty Chat state: Suggestions screen */
          <div className="max-w-3xl mx-auto h-full flex flex-col justify-center items-center py-12">
            <div className="p-4 bg-gradient-to-tr from-purple-900/30 to-indigo-900/30 rounded-full border border-purple-500/20 mb-6 animate-bounce">
              <Bot className="w-12 h-12 text-purple-400" />
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-white text-center leading-tight">
              How can Alvira help today?
            </h2>
            <p className="text-xs text-[#8b8e99] mt-2 font-light text-center max-w-sm">
              Incorporate files or images using the toolbar below. Swapping between **Alvira-Pro** and **Alvira-1** toggles model speed.
            </p>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.prompt)}
                  className="p-4 bg-[#16171f] hover:bg-[#1a1c27] rounded-2xl border border-purple-950/25 text-left transition group"
                >
                  <span className="text-xs font-bold text-white block group-hover:text-purple-400 transition-colors">
                    {s.label}
                  </span>
                  <span className="text-[10px] text-[#8b8e99] block mt-1 leading-normal font-light">
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat History display */
          <div className="max-w-4xl mx-auto space-y-6">
            {activeSession.messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Left Avatar for Bot */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-purple-400" />
                    </div>
                  )}

                  <div className="max-w-[80%] flex flex-col">
                    {/* User upload thumbnail */}
                    {msg.image && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-purple-950/30 max-w-xs self-end">
                        <img src={msg.image} alt="User attached file" className="w-full h-auto object-cover max-h-48" />
                      </div>
                    )}

                    {/* Chat Bubble container */}
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed relative ${
                        isUser
                          ? "bg-purple-600 text-white rounded-tr-none shadow-md shadow-purple-900/10"
                          : "bg-[#16171f] border border-purple-950/20 text-[#c5c6c7] rounded-tl-none"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <RenderMarkdown text={msg.text} />
                      )}

                      {/* Info footer */}
                      <div className="flex items-center justify-between mt-3 text-[9px] text-[#8b8e99] border-t border-purple-950/10 pt-1.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-2.5 h-2.5" /> {msg.timestamp}
                        </span>
                        {msg.simulated && (
                          <span className="px-1.5 py-0.5 bg-yellow-950/10 border border-yellow-500/20 rounded text-[8px] font-mono text-yellow-400 font-bold flex items-center gap-0.5 uppercase">
                            <AlertCircle className="w-2 h-2" /> Local Sandbox Mode
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Avatar for User */}
                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <img src={user.avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Loading Bubble */}
        {loading && (
          <div className="max-w-4xl mx-auto flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center shrink-0 animate-spin">
              <Bot className="w-4 h-4 text-purple-400" />
            </div>
            <div className="max-w-[80%]">
              <div className="bg-[#16171f] border border-purple-950/20 p-4 rounded-2xl rounded-tl-none text-[#8b8e99] text-xs flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span>Alvira AI is synthesizing response...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Input bar section */}
      <div className="p-4 border-t border-purple-950/25 bg-[#0d0e14]/50 shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Upload preview thumbnail row */}
          {attachedImage && (
            <div className="mb-3 px-4 py-2 bg-[#16171f] rounded-xl border border-purple-950/30 flex items-center justify-between max-w-sm">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded bg-[#101117] overflow-hidden flex items-center justify-center border border-purple-950/10 shrink-0">
                  <img src={`data:${attachedImage.mimeType};base64,${attachedImage.data}`} alt="Upload Thumbnail" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-[#c5c6c7] truncate max-w-[180px] font-mono">{attachedFileName}</span>
              </div>
              <button onClick={removeAttachment} className="p-1 hover:bg-purple-950/20 rounded-full text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Interactive Chat Form bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="bg-[#16171f] rounded-2xl border border-purple-950/35 p-2 flex items-center gap-1.5"
          >
            {/* Image uploader trigger */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-[#8b8e99] hover:text-white hover:bg-purple-950/10 rounded-xl transition"
              title="Attach File or Image"
            >
              <Image className="w-4.5 h-4.5" />
            </button>

            {/* Mic placeholder click */}
            <button
              type="button"
              onClick={() => alert("Voice transcription interface is loading. Speak after microphone tone starts.")}
              className="p-3 text-[#8b8e99] hover:text-white hover:bg-purple-950/10 rounded-xl transition"
              title="Voice transcription input"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>

            {/* Core Message Textbox */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value.slice(0, 1500))}
              placeholder="How can Alvira help today?..."
              className="flex-1 bg-transparent border-none outline-none text-[#c5c6c7] text-sm px-3 placeholder-[#555866]"
            />

            {/* Character indicator */}
            <span className="text-[10px] text-[#555866] font-mono select-none px-2 shrink-0">
              {inputVal.length} / 1500
            </span>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!inputVal.trim() && !attachedImage}
              className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none shadow transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
