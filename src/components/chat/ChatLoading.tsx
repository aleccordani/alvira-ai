import { Bot } from "lucide-react";

export default function ChatLoading() {
  return (
    <div className="max-w-4xl mx-auto flex gap-4 justify-start">
      <div className="w-8 h-8 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center shrink-0 animate-spin">
        <Bot className="w-4 h-4 text-purple-400" />
      </div>

      <div className="max-w-[80%]">
        <div className="bg-[#16171f] border border-purple-950/20 p-4 rounded-2xl rounded-tl-none text-[#8b8e99] text-xs flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
            <div
              className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>

          <span>Alvira AI is synthesizing response...</span>
        </div>
      </div>
    </div>
  );
}
