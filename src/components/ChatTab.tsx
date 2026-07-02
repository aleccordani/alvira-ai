import React, { useState, useRef, useEffect } from "react";
import { Send, Image, Mic, Sparkles, Bot, X, Paperclip } from "lucide-react";
import { ChatMessage, ChatSession, UserProfile } from "../types";
import { streamChat, type AiTool } from "../../services/chat";
import { uploadPdfToConversation } from "../../services/file";
import ChatMessageItem from "./chat/ChatMessageItem";
import ChatLoading from "./chat/ChatLoading";

interface ChatTabProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeSession: ChatSession | null;
  onUpdateSessionMessages: (sessionId: string, messages: ChatMessage[]) => void;
  preFilledPrompt: string;
  clearPreFilledPrompt: () => void;
  onRefreshConversations: () => Promise<void>;
  activeTool?: AiTool;
}

const createMessageTimestamp = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const createUserMessage = (
  text: string,
  attachedImage: {
    mimeType: string;
    data: string;
  } | null,
): ChatMessage => {
  const message: ChatMessage = {
    id: `local-user-${Date.now()}`,
    sender: "user",
    text,
    timestamp: createMessageTimestamp(),
  };

  if (attachedImage) {
    message.image = `data:${attachedImage.mimeType};base64,${attachedImage.data}`;
  }

  return message;
};

const createAssistantMessage = (): ChatMessage => {
  return {
    id: `local-assistant-${Date.now()}`,
    sender: "model",
    text: "Alvira is thinking...",
    timestamp: createMessageTimestamp(),
    simulated: false,
  };
};

export default function ChatTab({
  user,
  setUser,
  activeSession,
  onUpdateSessionMessages,
  onRefreshConversations,
  preFilledPrompt,
  clearPreFilledPrompt,
  activeTool = "general",
}: ChatTabProps) {
  const [modelMode, setModelMode] = useState<"Alvira-Pro" | "Alvira-1">(
    "Alvira-Pro",
  );
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{
    mimeType: string;
    data: string;
  } | null>(null);
  const [attachedFileName, setAttachedFileName] = useState("");
  const [attachedPdf, setAttachedPdf] = useState<File | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (preFilledPrompt) {
      setInputVal(preFilledPrompt);
      clearPreFilledPrompt();
    }
  }, [preFilledPrompt, clearPreFilledPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, loading]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        const base64String = (readerEvent.target.result as string).split(
          ",",
        )[1];

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
    setAttachedPdf(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePdfAttachment = () => {
    setAttachedPdf(null);

    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }
  };

  const handlePdfUpload = async (file: File) => {
    if (!activeSession) {
      alert("Please create a new chat first.");
      return;
    }

    try {
      setUploadingFile(true);

      await uploadPdfToConversation(activeSession.id, file);

      alert(
        `${file.name} uploaded successfully. You can now ask about this PDF.`,
      );
      await onRefreshConversations();
    } catch (error) {
      console.error(error);
      alert("Failed to upload PDF.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSend = async (messageText = inputVal) => {
    const finalMessageText =
      messageText.trim() ||
      (attachedPdf
        ? `Saya mengupload PDF: ${attachedPdf.name}. Tolong analisis dokumen ini.`
        : "");

    if (!finalMessageText.trim() && !attachedImage && !attachedPdf) return;

    if (!activeSession) {
      alert("Please create a new chat first.");
      return;
    }

    const userMessage = createUserMessage(finalMessageText, attachedImage);

    const assistantMessage = createAssistantMessage();

    onUpdateSessionMessages(activeSession.id, [
      ...activeSession.messages,
      userMessage,
      assistantMessage,
    ]);

    setInputVal("");
    removeAttachment();
    setLoading(false);

    let streamedText = "";

    try {
      if (attachedPdf) {
        await uploadPdfToConversation(activeSession.id, attachedPdf);
        removePdfAttachment();
      }
      const finalText = await streamChat(
        activeSession.id,
        finalMessageText,
        (chunk) => {
          streamedText += chunk;

          onUpdateSessionMessages(activeSession.id, [
            ...activeSession.messages,
            userMessage,
            {
              ...assistantMessage,
              text: streamedText,
              simulated:
                streamedText.includes("dummy") ||
                streamedText.includes("quota belum tersedia"),
            },
          ]);
        },
        activeTool,
      );

      if (finalText && finalText !== streamedText) {
        onUpdateSessionMessages(activeSession.id, [
          ...activeSession.messages,
          userMessage,
          {
            ...assistantMessage,
            text: finalText,
            simulated:
              finalText.includes("dummy") ||
              finalText.includes("quota belum tersedia"),
          },
        ]);
      }

      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + 100, prev.tokensLimit),
      }));

      await onRefreshConversations();
    } catch (error) {
      console.error(error);

      onUpdateSessionMessages(activeSession.id, [
        ...activeSession.messages,
        userMessage,
        {
          ...assistantMessage,
          text: "Gagal terhubung ke backend Alvira. Pastikan backend berjalan di http://localhost:5000.",
          simulated: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    {
      label: "Refactor Code",
      desc: "Refactor scripts to TypeScript",
      prompt:
        "Explain how to refactor an Express.js Node.js server into bundled TypeScript using tsx and esbuild",
    },
    {
      label: "Design Review",
      desc: "Examine mockup specifications",
      prompt:
        "Conduct a comprehensive accessibility and aesthetic design audit of a modern dark-themed SaaS interface",
    },
    {
      label: "Analyze Data",
      desc: "Formulate metrics from CSV logs",
      prompt:
        "Act as a data analyst. Formulate a step-by-step strategy to parse CSV telemetry logs and measure user drop-offs",
    },
    {
      label: "Creative Writing",
      desc: "Write high-converting copy",
      prompt:
        "Write an elegant, punchy product copy description for a new AI workspace tool named 'Alvira Flow Studio'",
    },
  ];

  return (
    <div
      className="flex-1 flex flex-col bg-[#0b0c10] text-[#c5c6c7] font-sans h-screen select-none"
      id="chat-tab"
    >
      <div className="p-4 border-b border-purple-950/25 flex items-center justify-between bg-[#0d0e14]/75 shrink-0">
        <div className="flex items-center bg-[#16171f] rounded-xl p-1 border border-purple-950/30">
          <button
            onClick={() => setModelMode("Alvira-Pro")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              modelMode === "Alvira-Pro"
                ? "bg-purple-600 text-white shadow"
                : "text-[#8b8e99] hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Alvira-Pro
          </button>

          <button
            onClick={() => setModelMode("Alvira-1")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              modelMode === "Alvira-1"
                ? "bg-purple-600 text-white shadow"
                : "text-[#8b8e99] hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> Alvira-1
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-purple-950/20 border border-purple-500/10 rounded-xl text-xs font-mono text-purple-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>
              {((user.tokensLimit - user.tokensUsed) / 1000).toFixed(0)}k
              Available Credits
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!activeSession || activeSession.messages.length === 0 ? (
          <div className="max-w-3xl mx-auto h-full flex flex-col justify-center items-center py-12">
            <div className="p-4 bg-gradient-to-tr from-purple-900/30 to-indigo-900/30 rounded-full border border-purple-500/20 mb-6 animate-bounce">
              <Bot className="w-12 h-12 text-purple-400" />
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-white text-center leading-tight">
              How can Alvira help today?
            </h2>

            <p className="text-xs text-[#8b8e99] mt-2 font-light text-center max-w-sm">
              Create a conversation, send a prompt, and Alvira will save the
              full chat history to PostgreSQL.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(suggestion.prompt)}
                  className="p-4 bg-[#16171f] hover:bg-[#1a1c27] rounded-2xl border border-purple-950/25 text-left transition group"
                >
                  <span className="text-xs font-bold text-white block group-hover:text-purple-400 transition-colors">
                    {suggestion.label}
                  </span>
                  <span className="text-[10px] text-[#8b8e99] block mt-1 leading-normal font-light">
                    {suggestion.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {activeSession.messages.map((message) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                userAvatarUrl={user.avatarUrl}
              />
            ))}
          </div>
        )}

        {loading && <ChatLoading />}

        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-purple-950/25 bg-[#0d0e14]/50 shrink-0">
        <div className="max-w-4xl mx-auto">
          {attachedPdf && (
            <div className="mb-3 px-4 py-2 bg-[#16171f] rounded-xl border border-purple-950/30 flex items-center justify-between max-w-sm">
              <div className="flex items-center gap-3 truncate">
                <div className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-400/20 flex items-center justify-center shrink-0">
                  <Paperclip className="w-4 h-4 text-red-300" />
                </div>

                <div className="truncate">
                  <span className="text-xs text-white truncate block font-semibold">
                    {attachedPdf.name}
                  </span>
                  <span className="text-[10px] text-[#8b8e99] uppercase">
                    PDF
                  </span>
                </div>
              </div>

              <button
                onClick={removePdfAttachment}
                className="p-1 hover:bg-purple-950/20 rounded-full text-[#8b8e99] hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
            className="bg-[#16171f] rounded-2xl border border-purple-950/35 p-2 flex items-center gap-1.5"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <input
              type="file"
              ref={pdfInputRef}
              accept="application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  setAttachedPdf(file);
                }

                event.target.value = "";
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-[#8b8e99] hover:text-white hover:bg-purple-950/10 rounded-xl transition"
              title="Attach File or Image"
            >
              <Image className="w-4.5 h-4.5" />
            </button>
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              disabled={uploadingFile}
              className="p-3 text-[#8b8e99] hover:text-white hover:bg-purple-950/10 rounded-xl transition disabled:opacity-50"
              title="Upload PDF"
            >
              <Paperclip className="w-4.5 h-4.5" />
            </button>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Voice transcription interface is loading. Speak after microphone tone starts.",
                )
              }
              className="p-3 text-[#8b8e99] hover:text-white hover:bg-purple-950/10 rounded-xl transition"
              title="Voice transcription input"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(event) =>
                setInputVal(event.target.value.slice(0, 1500))
              }
              placeholder={
                activeSession
                  ? "How can Alvira help today?..."
                  : "Create a new chat first..."
              }
              className="flex-1 bg-transparent border-none outline-none text-[#c5c6c7] text-sm px-3 placeholder-[#555866]"
            />

            <span className="text-[10px] text-[#555866] font-mono select-none px-2 shrink-0">
              {inputVal.length} / 1500
            </span>

            <button
              type="submit"
              disabled={
                loading || (!inputVal.trim() && !attachedImage && !attachedPdf)
              }
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
