import { AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

import alviraMark from "../../assets/alvira-mark.png";
import RenderMarkdown from "./RenderMarkdown";

type ChatMessage = {
  id: string;
  sender: "user" | "assistant" | "model";
  text: string;
  image?: string;
  timestamp?: string;
  simulated?: boolean;
};

type ChatMessageItemProps = {
  message: ChatMessage;
  userAvatarUrl: string;
  isStreaming?: boolean;
  showAvatar?: boolean;
};

export default function ChatMessageItem({
  message,
  userAvatarUrl,
  isStreaming = false,
  showAvatar = true,
}: ChatMessageItemProps) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.22,
        ease: "easeOut",
      }}
      className={`flex min-w-0 gap-3 sm:gap-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && showAvatar && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.75,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="relative h-9 w-9 shrink-0"
        >
          {isStreaming && (
            <>
              <motion.div
                animate={{
                  opacity: [0.25, 0.55, 0.25],
                  scale: [0.9, 1.12, 0.9],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-[-5px] rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/35 to-fuchsia-500/30 blur-md"
              />

              <motion.div
                animate={{
                  opacity: [0.2, 0.55, 0.2],
                  scale: [0.95, 1.22, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-[-3px] rounded-full border border-purple-400/30"
              />
            </>
          )}

          <motion.div
            animate={
              isStreaming
                ? {
                    scale: [1, 1.08, 1],
                    rotate: [0, -3, 3, 0],
                    y: [0, -2, 0],
                  }
                : {
                    scale: 1,
                    rotate: 0,
                    y: 0,
                  }
            }
            transition={
              isStreaming
                ? {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : {
                    duration: 0.25,
                  }
            }
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#101118] shadow-lg shadow-purple-950/20"
          >
            <img
              src={alviraMark}
              alt="Alvira AI"
              className="h-6 w-6 object-contain"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      )}

      <div className="flex min-w-0 max-w-[84%] flex-col sm:max-w-[80%]">
        {message.image && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="mb-2 max-w-xs self-end overflow-hidden rounded-xl border border-purple-950/30"
          >
            <img
              src={message.image}
              alt="User attached file"
              className="h-auto max-h-64 w-full object-cover"
            />
          </motion.div>
        )}

        <motion.div
          layout
          transition={{
            layout: {
              duration: 0.18,
              ease: "easeOut",
            },
          }}
          className={`relative min-w-0 rounded-2xl p-3.5 text-sm leading-relaxed sm:p-4 ${
            isUser
              ? "rounded-tr-none bg-purple-600 text-white shadow-md shadow-purple-900/10"
              : "rounded-tl-none border border-purple-950/20 bg-[#16171f] text-[#c5c6c7]"
          }`}
        >
          {isUser ? (
            <p className="break-words whitespace-pre-wrap">{message.text}</p>
          ) : (
            <div className="min-w-0 overflow-hidden">
              <RenderMarkdown text={message.text} />

              {isStreaming && (
                <motion.span
                  animate={{
                    opacity: [1, 0.25, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="ml-1 inline-block text-purple-300"
                >
                  ▋
                </motion.span>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-purple-950/10 pt-1.5 text-[9px] text-[#8b8e99]">
            {message.timestamp && (
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-2.5 w-2.5" />
                {message.timestamp}
              </span>
            )}

            {isStreaming && (
              <span className="flex items-center gap-1 font-medium text-purple-300">
                <motion.span
                  animate={{
                    opacity: [0.35, 1, 0.35],
                    scale: [0.85, 1.15, 0.85],
                  }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-purple-400"
                />
                Responding
              </span>
            )}

            {message.simulated && (
              <span className="flex items-center gap-0.5 rounded border border-yellow-500/20 bg-yellow-950/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase text-yellow-400">
                <AlertCircle className="h-2 w-2" />
                Local Sandbox Mode
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {isUser && showAvatar && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.22,
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-purple-500/20 bg-purple-600/10"
        >
          {userAvatarUrl ? (
            <img
              src={userAvatarUrl}
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-purple-300">U</span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
