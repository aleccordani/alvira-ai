import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  FileText,
  Image,
  Paperclip,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ChatMessage, ChatSession, UserProfile } from "../types";
import { ChatApiError, streamChat, type AiTool } from "../services/chat";
import { uploadPdfToConversation } from "../services/file";
import { billingService } from "../modules/billing/services/billing.service";
import ChatMessageItem from "./chat/ChatMessageItem";
import alviraMark from "../assets/alvira-mark.png";
import AuroraBackground from "../components/ui/AuroraBackground";
import DateDivider from "./chat/DateDivider";

interface ChatTabProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeSession: ChatSession | null;
  onUpdateSessionMessages: (sessionId: string, messages: ChatMessage[]) => void;
  preFilledPrompt: string;
  clearPreFilledPrompt: () => void;
  onRefreshConversations: () => Promise<void>;
  onCreateChat: () => Promise<string | null>;
  onNavigateToTab: (tab: string) => void;
  activeTool?: AiTool;
}

type ImageAttachment = {
  mimeType: string;
  data: string;
};

const MAX_PROMPT_LENGTH = 1500;
const MIN_CHAT_CREDITS = 100;
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024;

const createMessageTimestamp = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const createUserMessage = (
  text: string,
  attachedImage: ImageAttachment | null,
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

const createAssistantMessage = (): ChatMessage => ({
  id: `local-assistant-${Date.now()}`,
  sender: "model",
  text: "Alvira is thinking...",
  timestamp: createMessageTimestamp(),
  simulated: false,
});

const isSimulatedResponse = (text: string) => {
  const normalizedText = text.toLowerCase();

  return (
    normalizedText.includes("dummy") ||
    normalizedText.includes("quota belum tersedia")
  );
};

export default function ChatTab({
  user,
  setUser,
  activeSession,
  onUpdateSessionMessages,
  onRefreshConversations,
  onCreateChat,
  onNavigateToTab,
  preFilledPrompt,
  clearPreFilledPrompt,
  activeTool = "general",
}: ChatTabProps) {
  const [modelMode, setModelMode] = useState<"Alvira-Pro" | "Alvira-1">(
    "Alvira-1",
  );
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [attachedImage, setAttachedImage] = useState<ImageAttachment | null>(
    null,
  );
  const [attachedImageName, setAttachedImageName] = useState("");
  const [attachedPdf, setAttachedPdf] = useState<File | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { data: billing } = useQuery({
    queryKey: ["billing"],
    queryFn: billingService.getMyBilling,
  });

  const isPro =
    billing?.plan.type === "PRO" || billing?.plan.type === "BUSINESS";

  const availableCredits =
    billing?.creditsRemaining ??
    Math.max(user.tokensLimit - user.tokensUsed, 0);

  const hasEnoughChatCredits = availableCredits >= MIN_CHAT_CREDITS;

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

  useEffect(() => {
    setModelMode(isPro ? "Alvira-Pro" : "Alvira-1");
  }, [isPro]);

  useEffect(() => {
    if (!preFilledPrompt) return;

    setInputVal(preFilledPrompt);
    clearPreFilledPrompt();

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, [preFilledPrompt, clearPreFilledPrompt]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({
        behavior: loading ? "auto" : "smooth",
        block: "end",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [activeSession?.messages, loading]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  }, [inputVal]);

  const clearImageAttachment = () => {
    setAttachedImage(null);
    setAttachedImageName("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const clearPdfAttachment = () => {
    setAttachedPdf(null);

    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File yang dipilih harus berupa gambar.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error("Ukuran gambar maksimal 10 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const result = readerEvent.target?.result;

      if (typeof result !== "string") {
        toast.error("Gagal membaca gambar.");
        return;
      }

      const base64Data = result.split(",")[1];

      if (!base64Data) {
        toast.error("Format gambar tidak valid.");
        return;
      }

      setAttachedImage({
        mimeType: file.type,
        data: base64Data,
      });

      setAttachedImageName(file.name);
    };

    reader.onerror = () => {
      toast.error("Gagal membaca gambar.");
    };

    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("File yang dipilih harus berupa PDF.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      toast.error("Ukuran PDF maksimal 20 MB.");
      event.target.value = "";
      return;
    }

    setAttachedPdf(file);
    event.target.value = "";
  };

  const handleSend = async (messageText = inputVal) => {
    if (loading || uploadingFile) return;

    if (!hasEnoughChatCredits) {
      toast.error("Kredit kamu tidak cukup. Upgrade untuk melanjutkan.");
      onNavigateToTab("billing");
      return;
    }

    const finalMessageText =
      messageText.trim() ||
      (attachedPdf
        ? `Saya mengupload PDF: ${attachedPdf.name}. Tolong analisis dokumen ini.`
        : attachedImage
          ? "Tolong analisis gambar yang saya lampirkan."
          : "");

    if (!finalMessageText && !attachedImage && !attachedPdf) return;

    if (!activeSession) {
      const newSessionId = await onCreateChat();

      if (!newSessionId) {
        toast.error("Failed to create new chat.");
        return;
      }

      await onRefreshConversations();
      toast.success("New chat created. Please send your message again.");
      return;
    }

    const sessionId = activeSession.id;
    const existingMessages = activeSession.messages;
    const imageForMessage = attachedImage;
    const pdfForUpload = attachedPdf;

    const userMessage = createUserMessage(finalMessageText, imageForMessage);
    const assistantMessage = createAssistantMessage();

    onUpdateSessionMessages(sessionId, [
      ...existingMessages,
      userMessage,
      assistantMessage,
    ]);

    setInputVal("");
    clearImageAttachment();
    clearPdfAttachment();
    setLoading(true);

    let streamedText = "";

    try {
      if (pdfForUpload) {
        setUploadingFile(true);

        try {
          await uploadPdfToConversation(sessionId, pdfForUpload);
        } finally {
          setUploadingFile(false);
        }
      }

      const finalText = await streamChat(
        sessionId,
        finalMessageText,
        (chunk) => {
          streamedText += chunk;

          onUpdateSessionMessages(sessionId, [
            ...existingMessages,
            userMessage,
            {
              ...assistantMessage,
              text: streamedText,
              simulated: isSimulatedResponse(streamedText),
            },
          ]);
        },
        activeTool,
      );

      const completedText = finalText || streamedText;

      if (completedText) {
        onUpdateSessionMessages(sessionId, [
          ...existingMessages,
          userMessage,
          {
            ...assistantMessage,
            text: completedText,
            simulated: isSimulatedResponse(completedText),
          },
        ]);
      }

      setUser((previousUser) => ({
        ...previousUser,
        tokensUsed: Math.min(
          previousUser.tokensUsed + MIN_CHAT_CREDITS,
          previousUser.tokensLimit,
        ),
      }));

      await onRefreshConversations();
    } catch (error) {
      console.error("Chat processing failed:", error);

      const isCreditError =
        error instanceof ChatApiError &&
        (error.status === 402 || error.code === "INSUFFICIENT_CREDITS");

      if (isCreditError) {
        onUpdateSessionMessages(sessionId, existingMessages);
        toast.error("Kredit kamu sudah habis. Silakan upgrade paket.");
        onNavigateToTab("billing");
        return;
      }

      onUpdateSessionMessages(sessionId, [
        ...existingMessages,
        userMessage,
        {
          ...assistantMessage,
          text:
            error instanceof Error
              ? error.message
              : "Gagal terhubung ke backend Alvira.",
          simulated: true,
        },
      ]);

      toast.error("Chat gagal diproses.");
    } finally {
      setUploadingFile(false);
      setLoading(false);
    }
  };

  const handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void handleSend();
    }
  };

  const isSubmitDisabled =
    loading ||
    uploadingFile ||
    !hasEnoughChatCredits ||
    (!inputVal.trim() && !attachedImage && !attachedPdf);

  const shouldShowAvatar = (messages: ChatMessage[], index: number) => {
    const current = messages[index];
    const previous = messages[index - 1];

    if (!previous) return true;

    return previous.sender !== current.sender;
  };

  return (
    <section
      id="chat-tab"
      className="relative flex h-full min-h-0 min-w-0 flex-1 select-none flex-col overflow-hidden bg-[#0b0c10] font-sans text-[#c5c6c7]"
    >
      <AuroraBackground thinking={loading} />
      <header className="relative z-10 flex min-h-14 shrink-0 items-center justify-between gap-2 bg-[#0d0e14]/90 px-3 py-2 backdrop-blur sm:px-4">
        <div className="flex min-w-0 items-center rounded-xl border border-purple-950/30 bg-[#16171f] p-1">
          <button
            type="button"
            onClick={() => {
              if (!isPro) {
                toast.info("Upgrade ke Pro untuk menggunakan Alvira-Pro.");
                onNavigateToTab("billing");
                return;
              }

              setModelMode("Alvira-Pro");
            }}
            className={`flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-bold transition-all sm:px-3 sm:text-xs ${
              modelMode === "Alvira-Pro" && isPro
                ? "bg-purple-600 text-white shadow"
                : "text-[#8b8e99] hover:bg-purple-950/20 hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />

            <span className="whitespace-nowrap">Alvira-Pro</span>

            {!isPro && (
              <span className="hidden rounded bg-purple-500/15 px-1.5 py-0.5 text-[8px] uppercase text-purple-300 sm:inline">
                Upgrade
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setModelMode("Alvira-1")}
            className={`flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-bold transition-all sm:px-3 sm:text-xs ${
              modelMode === "Alvira-1"
                ? "bg-purple-600 text-white shadow"
                : "text-[#8b8e99] hover:bg-purple-950/20 hover:text-white"
            }`}
          >
            <Bot className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">Alvira-1</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToTab("billing")}
          className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-purple-500/10 bg-purple-950/20 px-2.5 font-mono text-[10px] text-purple-300 transition hover:border-purple-500/30 hover:bg-purple-950/35 sm:px-3.5 sm:text-xs"
          title={`${availableCredits.toLocaleString("id-ID")} available credits`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />

          <span className="sm:hidden">
            {availableCredits.toLocaleString("id-ID")}
          </span>

          <span className="hidden sm:inline">
            {availableCredits.toLocaleString("id-ID")} Available Credits
          </span>
        </button>
      </header>

      <div
        ref={chatScrollRef}
        className="relative z-10 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain scroll-smooth px-3 py-4 sm:px-6 sm:py-6"
      >
        {!activeSession || activeSession.messages.length === 0 ? (
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center py-6 sm:py-12">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/25 to-fuchsia-500/20 blur-xl animate-pulse" />
              <div className="relative mb-8 flex items-center justify-center">
                <div className="absolute h-24 w-24 rounded-full bg-purple-500/15 blur-3xl" />
                <img
                  src={alviraMark}
                  alt="ALVIRA"
                  className="relative h-20 w-20 drop-shadow-[0_0_32px_rgba(147,51,234,0.55)]"
                />
              </div>
            </div>

            <h2 className="text-center text-xl font-extrabold leading-tight text-white sm:text-2xl">
              How can Alvira help today?
            </h2>

            <p className="mt-2 max-w-sm px-2 text-center text-xs font-light leading-relaxed text-[#8b8e99]">
              Create a conversation, send a prompt, and Alvira will save your
              complete chat history securely.
            </p>

            <div className="mt-7 grid w-full grid-cols-1 gap-2.5 sm:mt-10 sm:grid-cols-2 sm:gap-4">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => void handleSend(suggestion.prompt)}
                  disabled={loading || uploadingFile}
                  className="min-h-[72px] rounded-2xl border border-purple-950/25 bg-[#16171f] p-4 text-left transition hover:border-purple-500/25 hover:bg-[#1a1c27] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="block text-xs font-bold text-white">
                    {suggestion.label}
                  </span>

                  <span className="mt-1 block text-[10px] font-light leading-normal text-[#8b8e99]">
                    {suggestion.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-4xl space-y-4 sm:space-y-6">
            {activeSession.messages.map((message, index) => {
              const isFirst = index === 0;

              const isLastMessage = index === activeSession.messages.length - 1;

              const isStreamingMessage =
                loading && isLastMessage && message.sender !== "user";

              return (
                <React.Fragment key={message.id}>
                  {isFirst && <DateDivider label="Today" />}

                  <div className="min-w-0">
                    <ChatMessageItem
                      message={message}
                      userAvatarUrl={user.avatarUrl}
                      isStreaming={isStreamingMessage}
                      showAvatar={shouldShowAvatar(
                        activeSession.messages,
                        index,
                      )}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* {loading && (
          <div className="mx-auto mt-4 w-full max-w-4xl">
            <ChatLoading />
          </div>
        )} */}

        <div ref={chatEndRef} className="h-1 scroll-mb-4" aria-hidden="true" />
      </div>

      <footer className="relative z-10 bg-[#0b0c10]/90 px-3 pt-3 backdrop-blur-xl sm:px-4">
        <div className="mx-auto w-full max-w-4xl">
          {(attachedImage || attachedPdf) && (
            <div className="mb-2 flex max-w-full gap-2 overflow-x-auto pb-1">
              {attachedImage && (
                <div className="flex min-w-0 max-w-[280px] shrink-0 items-center gap-2 rounded-xl border border-purple-950/30 bg-[#16171f] p-2">
                  <img
                    src={`data:${attachedImage.mimeType};base64,${attachedImage.data}`}
                    alt="Attachment preview"
                    className="h-10 w-10 shrink-0 rounded-lg border border-purple-950/30 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-white">
                      {attachedImageName || "Attached image"}
                    </span>

                    <span className="text-[9px] uppercase tracking-wide text-[#8b8e99]">
                      Image
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={clearImageAttachment}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8b8e99] transition hover:bg-red-950/20 hover:text-red-400"
                    aria-label="Remove image attachment"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {attachedPdf && (
                <div className="flex min-w-0 max-w-[280px] shrink-0 items-center gap-2 rounded-xl border border-purple-950/30 bg-[#16171f] p-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-400/20 bg-red-500/15">
                    <FileText className="h-4 w-4 text-red-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-white">
                      {attachedPdf.name}
                    </span>

                    <span className="text-[9px] uppercase tracking-wide text-[#8b8e99]">
                      PDF
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={clearPdfAttachment}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8b8e99] transition hover:bg-red-950/20 hover:text-red-400"
                    aria-label="Remove PDF attachment"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSend();
            }}
            className="flex min-w-0 items-end gap-1.5 rounded-3xl bg-[#16171f]/90 p-1.5 backdrop-blur-xl transition sm:gap-2 sm:p-2"
          >
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={loading || uploadingFile}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#8b8e99] transition hover:bg-purple-950/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
              title="Attach image"
              aria-label="Attach image"
            >
              <Image className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              disabled={loading || uploadingFile}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#8b8e99] transition hover:bg-purple-950/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
              title="Attach PDF"
              aria-label="Attach PDF"
            >
              <Paperclip className="h-[18px] w-[18px]" />
            </button>

            <div className="min-w-0 flex-1 px-1 py-1">
              <textarea
                ref={textareaRef}
                value={inputVal}
                rows={1}
                maxLength={MAX_PROMPT_LENGTH}
                disabled={!hasEnoughChatCredits || loading || uploadingFile}
                onChange={(event) => setInputVal(event.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder={
                  !hasEnoughChatCredits
                    ? "Credits exhausted. Upgrade your plan..."
                    : uploadingFile
                      ? "Uploading document..."
                      : activeSession
                        ? "Message Alvira..."
                        : "Create a new chat first..."
                }
                className="block max-h-32 min-h-9 w-full resize-none overflow-y-auto border-none bg-transparent px-1 py-2 text-sm leading-5 text-[#c5c6c7] outline-none placeholder:text-[#555866] disabled:cursor-not-allowed disabled:opacity-50"
              />

              <div className="hidden justify-end px-1 sm:flex">
                <span className="font-mono text-[9px] text-[#555866]">
                  {inputVal.length} / {MAX_PROMPT_LENGTH}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow transition-all hover:opacity-90 disabled:pointer-events-none disabled:opacity-30 sm:h-11 sm:w-11"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <p className="px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 text-center text-[9px] text-[#555866] sm:text-[10px]">
            Alvira may make mistakes. Verify important information.
          </p>
        </div>
      </footer>
    </section>
  );
}
