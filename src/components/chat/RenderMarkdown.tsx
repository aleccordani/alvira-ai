import { useState } from "react";
import { Copy, Check } from "lucide-react";
import hljs from "highlight.js";

function parseInlineMarkdown(text: string) {
  if (!text) return "";

  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 bg-purple-950/20 border border-purple-500/20 text-[#a78bfa] rounded text-xs font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const subParts = part.split(/(\*\*[^*]+\*\*)/g);

    return subParts.map((subPart, subIndex) => {
      if (subPart.startsWith("**") && subPart.endsWith("**")) {
        return (
          <strong key={subIndex} className="text-white font-bold">
            {subPart.slice(2, -2)}
          </strong>
        );
      }

      return subPart;
    });
  });
}

export default function RenderMarkdown({ text }: { text: string }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!text) return null;

  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-[#c5c6c7] break-words">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "";
          const code = match ? match[2] : part.slice(3, -3);
          const blockId = `code-${index}`;

          return (
            <div
              key={index}
              className="rounded-xl overflow-hidden border border-purple-950/30 bg-[#0a0a0f] my-3"
            >
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

              <pre className="p-4 overflow-x-auto text-xs font-mono leading-normal">
                <code
                  dangerouslySetInnerHTML={{
                    __html: lang
                      ? hljs.highlight(code, { language: lang }).value
                      : hljs.highlightAuto(code).value,
                  }}
                />
              </pre>
            </div>
          );
        }

        const lines = part.split("\n");

        return (
          <div key={index} className="space-y-2">
            {lines.map((line, lineIndex) => {
              if (line.startsWith("### ")) {
                return (
                  <h4
                    key={lineIndex}
                    className="text-base font-bold text-white pt-2"
                  >
                    {line.slice(4)}
                  </h4>
                );
              }

              if (line.startsWith("## ")) {
                return (
                  <h3
                    key={lineIndex}
                    className="text-lg font-bold text-white pt-3 border-b border-purple-950/10 pb-1"
                  >
                    {line.slice(3)}
                  </h3>
                );
              }

              if (line.startsWith("* ") || line.startsWith("- ")) {
                return (
                  <ul key={lineIndex} className="list-disc pl-5 space-y-1 my-1">
                    <li className="text-sm">
                      {parseInlineMarkdown(line.slice(2))}
                    </li>
                  </ul>
                );
              }

              if (/^\d+\.\s/.test(line)) {
                const match = line.match(/^(\d+)\.\s(.*)/);

                return (
                  <ol
                    key={lineIndex}
                    className="list-decimal pl-5 space-y-1 my-1"
                  >
                    <li className="text-sm">
                      {parseInlineMarkdown(match ? match[2] : line)}
                    </li>
                  </ol>
                );
              }

              if (line.trim() === "") {
                return <div key={lineIndex} className="h-2" />;
              }

              return (
                <p key={lineIndex} className="text-sm">
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
