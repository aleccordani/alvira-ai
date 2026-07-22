import alviraMark from "../../assets/alvira-mark.png";

export default function ChatLoading() {
  return (
    <div className="mx-auto flex w-full max-w-4xl justify-start gap-3 sm:gap-4">
      <div className="relative h-9 w-9 shrink-0">
        <div className="absolute inset-[-5px] rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/35 to-fuchsia-500/30 blur-md animate-pulse" />

        <div className="absolute inset-[-3px] rounded-full border border-purple-400/30 animate-ping [animation-duration:2s]" />

        <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-purple-500/30 bg-[#101118] shadow-lg shadow-purple-950/30 animate-pulse">
          <img
            src={alviraMark}
            alt="Alvira AI is thinking"
            className="h-6 w-6 object-contain"
            draggable={false}
          />
        </div>
      </div>

      <div className="min-w-0 max-w-[84%] sm:max-w-[80%]">
        <div className="flex min-h-16 items-center gap-3 rounded-2xl rounded-tl-none border border-purple-950/20 bg-[#16171f] px-4 py-3 text-xs text-[#8b8e99]">
          <div className="flex shrink-0 gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" />

            <span
              className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />

            <span
              className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>

          <span className="leading-relaxed">
            Alvira sedang menyusun jawaban terbaik...
          </span>
        </div>
      </div>
    </div>
  );
}
