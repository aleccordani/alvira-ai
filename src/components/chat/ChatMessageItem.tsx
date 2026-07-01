import { AlertCircle, Bot, Clock } from "lucide-react";
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
};

export default function ChatMessageItem({
  message,
  userAvatarUrl,
}: ChatMessageItemProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-purple-400" />
        </div>
      )}

      <div className="max-w-[80%] flex flex-col">
        {message.image && (
          <div className="mb-2 rounded-xl overflow-hidden border border-purple-950/30 max-w-xs self-end">
            <img
              src={message.image}
              alt="User attached file"
              className="w-full h-auto object-cover max-h-48"
            />
          </div>
        )}

        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed relative ${
            isUser
              ? "bg-purple-600 text-white rounded-tr-none shadow-md shadow-purple-900/10"
              : "bg-[#16171f] border border-purple-950/20 text-[#c5c6c7] rounded-tl-none"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.text}</p>
          ) : (
            <RenderMarkdown text={message.text} />
          )}

          <div className="flex items-center justify-between mt-3 text-[9px] text-[#8b8e99] border-t border-purple-950/10 pt-1.5">
            {message.timestamp && (
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-2.5 h-2.5" /> {message.timestamp}
              </span>
            )}

            {message.simulated && (
              <span className="px-1.5 py-0.5 bg-yellow-950/10 border border-yellow-500/20 rounded text-[8px] font-mono text-yellow-400 font-bold flex items-center gap-0.5 uppercase">
                <AlertCircle className="w-2 h-2" /> Local Sandbox Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center shrink-0">
          <img
            src={userAvatarUrl}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
