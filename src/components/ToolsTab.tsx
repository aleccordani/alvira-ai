import React, { useState } from "react";
import {
  Code2,
  BookOpen,
  Globe,
  PenTool,
  Image as ImageIcon,
  TrendingUp,
  Cpu,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  ChevronLeft,
} from "lucide-react";
import { UserProfile } from "../types";

interface ToolsTabProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export default function ToolsTab({ user, setUser }: ToolsTabProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tool 1: Code Studio state
  const [codePrompt, setCodePrompt] = useState("Create a TypeScript debounce utility function with generic parameter types.");
  const [codeLang, setCodeLang] = useState("TypeScript");
  const [generatedCode, setGeneratedCode] = useState(`// Connect your GEMINI_API_KEY to synthesize real-time code
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}`);
  const [codeExplanation, setCodeExplanation] = useState("The debounce helper prevents a function from triggering continuously, waiting until a delay window expires.");

  // Tool 2: Summarizer state
  const [summarizerText, setSummarizerText] = useState("Alvira AI is built secure from the ground up, utilizing containerized environments to handle files server-side. Multi-tier token billing enables organizations to scale their utility demands gracefully. By proxying the API requests securely, the client never directly accesses any secret variables, eliminating the possibility of client-side key leaks. Developers can easily configure customized system prompts inside their user settings to customize the model tone.");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [generatedSummary, setGeneratedSummary] = useState("");

  // Tool 3: Translator state
  const [translateText, setTranslateText] = useState("Welcome back, Alex. Let's build something beautiful and productive today.");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [translatedResult, setTranslatedResult] = useState("");

  const toolsList = [
    {
      id: "coder",
      name: "Neural Code Studio",
      desc: "Generate, refactor, and audit software components in 30+ languages.",
      category: "Programming",
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      colorClass: "border-blue-900/30 hover:border-blue-600/40",
    },
    {
      id: "summarizer",
      name: "Doc Summarizer",
      desc: "Condense long logs, transcripts, or specifications into a bulleted digest.",
      category: "Analysis",
      icon: <BookOpen className="w-5 h-5 text-indigo-400" />,
      colorClass: "border-indigo-900/30 hover:border-indigo-600/40",
    },
    {
      id: "lingoflow",
      name: "LingoFlow Translator",
      desc: "Accurately translate technical and marketing content maintaining original tone.",
      category: "Languages",
      icon: <Globe className="w-5 h-5 text-emerald-400" />,
      colorClass: "border-emerald-900/30 hover:border-emerald-600/40",
    },
    {
      id: "writer",
      idMock: true,
      name: "Writing Assistant",
      desc: "Draft blogs, social copy, and cold email workflows instantly.",
      category: "Content",
      icon: <PenTool className="w-5 h-5 text-purple-400" />,
      colorClass: "border-purple-900/30 hover:border-purple-600/40",
    },
    {
      id: "prompter",
      idMock: true,
      name: "Image Prompter",
      desc: "Synthesize extremely high-fidelity prompts for stable image diffusion.",
      category: "Creative",
      icon: <ImageIcon className="w-5 h-5 text-pink-400" />,
      colorClass: "border-pink-900/30 hover:border-pink-600/40",
    },
    {
      id: "strategy",
      idMock: true,
      name: "Business Strategy Canvas",
      desc: "Draft visual lean canvases, market briefs, and model outlines.",
      category: "Strategy",
      icon: <TrendingUp className="w-5 h-5 text-yellow-400" />,
      colorClass: "border-yellow-900/30 hover:border-yellow-600/40",
    },
  ];

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run Code Generator
  const runCodeGenerator = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: codePrompt, language: codeLang }),
      });
      const data = await res.json();
      setGeneratedCode(data.code || "");
      setCodeExplanation(data.explanation || "");
      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + (data.simulated ? 100 : 1800), prev.tokensLimit),
      }));
    } catch (err) {
      console.error(err);
      alert("Error reaching the Code Studio neural node. Re-verify development server status.");
    } finally {
      setLoading(false);
    }
  };

  // Run Summarizer
  const runSummarizer = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summarizerText, length: summaryLength }),
      });
      const data = await res.json();
      setGeneratedSummary(data.summary || "");
      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + (data.simulated ? 100 : 1500), prev.tokensLimit),
      }));
    } catch (err) {
      console.error(err);
      alert("Error reaching the Summarization node.");
    } finally {
      setLoading(false);
    }
  };

  // Run Translator
  const runTranslator = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translateText, targetLanguage: targetLang }),
      });
      const data = await res.json();
      setTranslatedResult(data.translatedText || "");
      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + (data.simulated ? 50 : 1000), prev.tokensLimit),
      }));
    } catch (err) {
      console.error(err);
      alert("Error reaching the LingoFlow Translation node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0c10] text-[#c5c6c7] p-8 font-sans selection:bg-purple-600 selection:text-white" id="tools-tab">
      {/* Back to Grid button */}
      {activeTool && (
        <button
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-1.5 text-xs text-[#8b8e99] hover:text-white mb-6 group transition-all"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Tools Catalog</span>
        </button>
      )}

      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          {activeTool === "coder" && "Neural Code Studio"}
          {activeTool === "summarizer" && "Doc Summarizer Workplace"}
          {activeTool === "lingoflow" && "LingoFlow Translator Suite"}
          {!activeTool && "Specialized AI Tools"}
        </h1>
        <p className="text-xs text-[#8b8e99] mt-1.5 font-light">
          {activeTool === "coder" && "Generate highly optimized structural code snippets with type checking."}
          {activeTool === "summarizer" && "Distill corporate logs and user summaries into pristine, readable insights."}
          {activeTool === "lingoflow" && "Bridge multi-language assets instantly maintaining exact formatting."}
          {!activeTool && "Launch dedicated micro-utility workstations scaled to your operational pipeline."}
        </p>
      </div>

      {/* Main Grid: Catalog display */}
      {!activeTool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {toolsList.map((tool) => (
            <div
              key={tool.id}
              id={`tool-${tool.id}`}
              onClick={() => {
                if (tool.idMock) {
                  alert(`The ${tool.name} workstation is preparing its assets. In the meantime, evaluate the active LingoFlow, Neural Code Studio, or Doc Summarizer endpoints!`);
                } else {
                  setActiveTool(tool.id);
                }
              }}
              className={`bg-[#16171f] p-6 rounded-2xl border ${tool.colorClass} flex flex-col justify-between h-56 transition group cursor-pointer relative overflow-hidden`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-purple-950/20 rounded-xl mb-4 group-hover:bg-purple-900/30 transition-colors">
                    {tool.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-[#8b8e99] bg-[#12131a] px-2 py-0.5 rounded uppercase">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-[#8b8e99] mt-2 leading-relaxed font-light">
                  {tool.desc}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-purple-400 group-hover:text-purple-300 transition-all">
                <span>{tool.idMock ? "Request Access" : "Open Workspace"}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Workstation active layout */
        <div className="max-w-4xl bg-[#16171f] border border-purple-950/20 rounded-2xl p-6 md:p-8">
          {/* Coder Studio Tool Active */}
          {activeTool === "coder" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">Generation Prompt</label>
                  <textarea
                    rows={2}
                    value={codePrompt}
                    onChange={(e) => setCodePrompt(e.target.value)}
                    className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-600/50 resize-none font-mono"
                  ></textarea>
                </div>
                <div>
                  <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">Target Language</label>
                  <select
                    value={codeLang}
                    onChange={(e) => setCodeLang(e.target.value)}
                    className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-600/50 h-[72px]"
                  >
                    <option>TypeScript</option>
                    <option>React (TSX)</option>
                    <option>Python</option>
                    <option>Go</option>
                    <option>SQL (PostgreSQL)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={runCodeGenerator}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-30 shadow"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                <span>{loading ? "Compiling Logic..." : "Synthesize Studio Code"}</span>
              </button>

              <div className="pt-4 border-t border-purple-950/15">
                <div className="bg-[#0a0a0f] rounded-xl border border-purple-950/30 overflow-hidden">
                  <div className="bg-[#121218] px-4 py-2 border-b border-purple-950/25 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">{codeLang} Output Editor</span>
                    <button
                      onClick={() => copyCode(generatedCode)}
                      className="p-1 text-[#8b8e99] hover:text-white flex items-center gap-1 text-[10px] font-semibold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs font-mono text-[#dcdce0] leading-relaxed max-h-72">
                    <code>{generatedCode}</code>
                  </pre>
                </div>

                {codeExplanation && (
                  <div className="mt-4 p-4 bg-[#101117] rounded-xl border border-purple-950/15 text-xs text-[#8b8e99] leading-relaxed">
                    <span className="font-bold text-white block mb-1">Architectural Insight:</span>
                    {codeExplanation}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summarizer Tool Active */}
          {activeTool === "summarizer" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">Paste raw transcript, notes, or logs</label>
                <textarea
                  rows={6}
                  value={summarizerText}
                  onChange={(e) => setSummarizerText(e.target.value)}
                  className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-600/50 resize-y leading-relaxed font-sans"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 justify-between flex-wrap">
                <div className="flex gap-2">
                  {["short", "medium", "long"].map((len) => (
                    <button
                      key={len}
                      onClick={() => setSummaryLength(len)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border capitalize transition-all ${
                        summaryLength === len
                          ? "bg-purple-600/20 border-purple-500 text-purple-300"
                          : "bg-[#101117] border-purple-950/30 text-[#8b8e99] hover:text-white"
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>

                <button
                  onClick={runSummarizer}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-30 shadow"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 animate-pulse" />}
                  <span>{loading ? "Extracting insights..." : "Draft Bulleted Summary"}</span>
                </button>
              </div>

              {generatedSummary && (
                <div className="pt-4 border-t border-purple-950/15">
                  <div className="bg-[#101117] border border-purple-950/20 rounded-xl p-5 text-sm leading-relaxed text-[#c5c6c7] whitespace-pre-line">
                    <span className="font-bold text-white block mb-3 border-b border-purple-950/10 pb-1.5">Executive Digest Summary:</span>
                    {generatedSummary}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LingoFlow Translator Active */}
          {activeTool === "lingoflow" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">Original Text</label>
                  <textarea
                    rows={4}
                    value={translateText}
                    onChange={(e) => setTranslateText(e.target.value)}
                    className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-600/50 resize-none leading-relaxed"
                  ></textarea>
                </div>
                <div>
                  <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">Target Language</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-600/50 h-[106px]"
                  >
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Japanese</option>
                    <option>Arabic</option>
                  </select>
                </div>
              </div>

              <button
                onClick={runTranslator}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-30 shadow"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                <span>{loading ? "Translating context..." : "Run LingoFlow Translation"}</span>
              </button>

              {translatedResult && (
                <div className="pt-4 border-t border-purple-950/15">
                  <div className="bg-[#101117] border border-purple-950/20 rounded-xl p-5 text-sm leading-relaxed text-emerald-400 font-mono">
                    <span className="font-bold text-white block mb-2 text-xs font-sans">Polyglot Translated Output:</span>
                    {translatedResult}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
