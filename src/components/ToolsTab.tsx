import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Code2,
  BookOpen,
  Globe,
  PenTool,
  Image as ImageIcon,
  TrendingUp,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  ChevronLeft,
  Trash2,
} from "lucide-react";
import { UserProfile } from "../types";
import { AiTool } from "../services/chat";
import { explainCode, CodeLanguage, ExplainCodeResult } from "../services/code";
import CodeEditor from "./code/CodeEditor";
import { streamCodeExplanation } from "../services/code-stream";
import { useAiTool } from "../modules/ai-tools";
import { imageGenerationService } from "../modules/image-generation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  SectionCard,
  EmptyState,
  LoadingSkeleton,
  ActionButton,
} from "../shared/ui";

interface ToolsTabProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenToolChat: (tool: AiTool) => void;
}

export default function ToolsTab({
  user,
  setUser,
  onOpenToolChat,
}: ToolsTabProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [copiedImagePrompt, setCopiedImagePrompt] = useState(false);

  const { data: imageHistory = [], refetch: refetchImageHistory } = useQuery({
    queryKey: ["image-history"],
    queryFn: imageGenerationService.getHistory,
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: imageGenerationService.delete,

    onSuccess: async () => {
      toast.success("Image deleted");
      await refetchImageHistory();
    },

    onError: () => {
      toast.error("Failed to delete image");
    },
  });

  // Tool 1: Code Studio state
  const [codeInput, setCodeInput] = useState(
    "function hello(){console.log('Hello ALVIRA')}",
  );
  const [codeLang, setCodeLang] = useState<CodeLanguage>("typescript");
  const [codeResult, setCodeResult] = useState<ExplainCodeResult | null>(null);
  const [codeError, setCodeError] = useState("");
  const codeTool = useAiTool("code-explainer");

  // Tool 2: Summarizer state
  const [summarizerText, setSummarizerText] = useState(
    "Alvira AI is built secure from the ground up, utilizing containerized environments to handle files server-side. Multi-tier token billing enables organizations to scale their utility demands gracefully. By proxying the API requests securely, the client never directly accesses any secret variables, eliminating the possibility of client-side key leaks. Developers can easily configure customized system prompts inside their user settings to customize the model tone.",
  );
  const [summaryLength, setSummaryLength] = useState("medium");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const summarizerTool = useAiTool("summarizer");

  // Tool 3: Translator state
  const [translateText, setTranslateText] = useState(
    "Welcome back, Alex. Let's build something beautiful and productive today.",
  );

  const translatorTool = useAiTool("translator");
  const [targetLang, setTargetLang] = useState("Indonesian");
  const [translatedResult, setTranslatedResult] = useState("");

  // Tool 4: Writing Assistant state
  const [writerPrompt, setWriterPrompt] = useState(
    "Write a professional follow-up email to a potential client about ALVIRA AI SaaS.",
  );
  const [writerResult, setWriterResult] = useState("");
  const writerTool = useAiTool("email-writer");

  // Tool 5: Business Analyzer state
  const [businessIdea, setBusinessIdea] = useState(
    "AI SaaS platform for students, creators, and small businesses",
  );
  const [businessResult, setBusinessResult] = useState("");
  const businessTool = useAiTool("business-analyzer");

  // Tool 6: Image Prompter state
  const [imagePromptInput, setImagePromptInput] = useState(
    "Futuristic AI SaaS dashboard with dark theme, glowing purple and blue accents, analytics charts, modern UI, 3D perspective",
  );
  const [imagePromptResult, setImagePromptResult] = useState("");
  const imagePrompterTool = useAiTool("image-prompter");

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

  const toolMap: Record<string, AiTool> = {
    coder: "neural-code-studio",
    summarizer: "doc-summarizer",
    lingoflow: "lingoflow-translator",
    writer: "writing-assistant",
    prompter: "image-prompter",
    strategy: "business-strategy-canvas",
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run Code Generator
  const runCodeGenerator = async () => {
    setLoading(true);
    setCodeError("");
    setCodeResult(null);

    try {
      const result = await codeTool.run(
        `Language: ${codeLang}

${codeInput}`,
      );

      setCodeResult({
        summary: result,
        explanation: [
          {
            title: "Neural Code Studio Analysis",
            content: result,
          },
        ],
        complexity: "See analysis report",
        bestPractices: [
          "Use clear naming",
          "Keep functions focused",
          "Add validation where needed",
        ],
        suggestions: [
          "Improve readability",
          "Add error handling",
          "Consider unit tests",
        ],
      });

      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + 100, prev.tokensLimit),
      }));
    } catch (err) {
      console.error(err);
      setCodeError("Failed to analyze code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Run Summarizer
  const runSummarizer = async () => {
    setLoading(true);

    try {
      const result = await summarizerTool.run(
        `Summary length: ${summaryLength}\n\n${summarizerText}`,
      );

      setGeneratedSummary(result);

      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + 150, prev.tokensLimit),
      }));
    } catch (err) {
      console.error(err);
      alert("Error reaching the AI Tools summarizer.");
    } finally {
      setLoading(false);
    }
  };

  // Run Translator
  const runTranslator = async () => {
    setLoading(true);

    try {
      const result = await translatorTool.run(
        `Translate to ${targetLang}

${translateText}`,
      );

      setTranslatedResult(result);

      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + 120, prev.tokensLimit),
      }));
    } catch (err) {
      console.error(err);
      alert("Translator failed.");
    } finally {
      setLoading(false);
    }
  };

  const runBusinessAnalyzer = async () => {
    setLoading(true);

    try {
      const result = await businessTool.run(businessIdea);

      setBusinessResult(result);

      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + 150, prev.tokensLimit),
      }));
    } catch (err) {
      console.error(err);
      alert("Business Analyzer failed.");
    } finally {
      setLoading(false);
    }
  };

  const runImagePrompter = async () => {
    setLoading(true);
    setImageError("");

    try {
      const promptResult = await imagePrompterTool.run(imagePromptInput);
      setImagePromptResult(promptResult);

      const imageResult = await imageGenerationService.generate({
        prompt: promptResult,
      });

      setGeneratedImageUrl(imageResult.image);

      await refetchImageHistory();
      toast.success("Image generated successfully!");

      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + 250, prev.tokensLimit),
      }));
    } catch (err) {
      console.error(err);
      setImageError("Image generation failed. Please try again.");
      toast.error("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  const copyImagePrompt = async () => {
    await navigator.clipboard.writeText(imagePromptResult || imagePromptInput);
    toast.success("Prompt copied!");
    setCopiedImagePrompt(true);
    setTimeout(() => setCopiedImagePrompt(false), 2000);
  };

  const downloadGeneratedImage = () => {
    if (!generatedImageUrl) return;

    const link = document.createElement("a");
    link.href = generatedImageUrl;
    link.download = "alvira-generated-image.png";
    link.target = "_blank";
    link.click();
  };

  const runWriter = async () => {
    setLoading(true);

    try {
      const result = await writerTool.run(writerPrompt);

      setWriterResult(result);

      setUser((prev) => ({
        ...prev,
        tokensUsed: Math.min(prev.tokensUsed + 120, prev.tokensLimit),
      }));
    } catch (err) {
      console.error(err);
      alert("Error reaching the Writing Assistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto bg-[#0b0c10] text-[#c5c6c7] p-8 font-sans selection:bg-purple-600 selection:text-white"
      id="tools-tab"
    >
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
          {activeTool === "writer" && "Writing Assistant"}
          {activeTool === "writer" &&
            "Draft emails, content, and business copy with professional structure."}
          {!activeTool && "Specialized AI Tools"}
          {activeTool === "prompter" && "AI Image Prompt Studio"}
          {activeTool === "strategy" && "Business Strategy Canvas"}
        </h1>
        <p className="text-xs text-[#8b8e99] mt-1.5 font-light">
          {activeTool === "coder" &&
            "Generate highly optimized structural code snippets with type checking."}
          {activeTool === "summarizer" &&
            "Distill corporate logs and user summaries into pristine, readable insights."}
          {activeTool === "lingoflow" &&
            "Bridge multi-language assets instantly maintaining exact formatting."}
          {!activeTool &&
            "Launch dedicated micro-utility workstations scaled to your operational pipeline."}
          {activeTool === "strategy" &&
            "Analyze market potential, target customers, weaknesses, and revenue opportunities."}
          {activeTool === "prompter" &&
            "Create detailed prompts for Midjourney, DALL·E, Stable Diffusion, and other image models."}
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
                if (tool.id === "coder") {
                  setActiveTool("coder");
                  return;
                }
                if (tool.id === "summarizer") {
                  setActiveTool("summarizer");
                  return;
                }
                if (tool.id === "writer") {
                  setActiveTool("writer");
                  return;
                }
                if (tool.id === "prompter") {
                  setActiveTool("prompter");
                  return;
                }
                if (tool.id === "lingoflow") {
                  setActiveTool("lingoflow");
                  return;
                }
                if (tool.id === "strategy") {
                  setActiveTool("strategy");
                  return;
                }
                onOpenToolChat(toolMap[tool.id]);
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
                <span>Open Workspace →</span>
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
                  <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">
                    Source Code
                  </label>

                  <CodeEditor
                    value={codeInput}
                    language={codeLang}
                    onChange={setCodeInput}
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">
                    Language
                  </label>

                  <select
                    value={codeLang}
                    onChange={(e) =>
                      setCodeLang(e.target.value as CodeLanguage)
                    }
                    className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-4 text-xs text-white"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="php">PHP</option>
                    <option value="go">Go</option>
                  </select>

                  <button
                    onClick={runCodeGenerator}
                    disabled={loading}
                    className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xs font-bold text-white"
                  >
                    {loading ? "Analyzing..." : "Explain Code"}
                  </button>
                </div>
              </div>

              {codeError && (
                <div className="text-red-400 text-sm">{codeError}</div>
              )}

              {codeResult && (
                <div className="space-y-4">
                  <div className="bg-[#101117] rounded-xl p-5">
                    <h3 className="font-bold mb-2">Summary</h3>
                    <p>{codeResult.summary}</p>
                  </div>

                  <div className="bg-[#101117] rounded-xl p-5">
                    <h3 className="font-bold mb-2">Explanation</h3>

                    {codeResult.explanation.map((item, index) => (
                      <div key={index} className="mb-4">
                        <h4 className="font-semibold">{item.title}</h4>
                        <p>{item.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#101117] rounded-xl p-5">
                    <h3 className="font-bold mb-2">Complexity</h3>
                    <p>{codeResult.complexity}</p>
                  </div>

                  <div className="bg-[#101117] rounded-xl p-5">
                    <h3 className="font-bold mb-2">Best Practices</h3>

                    <ul className="list-disc ml-5">
                      {codeResult.bestPractices.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#101117] rounded-xl p-5">
                    <h3 className="font-bold mb-2">Suggestions</h3>

                    <ul className="list-disc ml-5">
                      {codeResult.suggestions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Writing Assistant Active */}
          {activeTool === "writer" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">
                  What do you want to write?
                </label>

                <textarea
                  rows={6}
                  value={writerPrompt}
                  onChange={(e) => setWriterPrompt(e.target.value)}
                  className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-600/50 resize-y leading-relaxed font-sans"
                />
              </div>

              <button
                onClick={runWriter}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-30 shadow"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <PenTool className="w-4 h-4" />
                )}
                <span>{loading ? "Writing..." : "Generate Writing"}</span>
              </button>

              {writerResult && (
                <div className="pt-4 border-t border-purple-950/15">
                  <div className="bg-[#101117] border border-purple-950/20 rounded-xl p-5 text-sm leading-relaxed text-[#c5c6c7] whitespace-pre-line">
                    <span className="font-bold text-white block mb-3 border-b border-purple-950/10 pb-1.5">
                      Generated Draft:
                    </span>
                    {writerResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summarizer Tool Active */}
          {activeTool === "summarizer" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">
                  Paste raw transcript, notes, or logs
                </label>
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
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  )}
                  <span>
                    {loading
                      ? "Extracting insights..."
                      : "Draft Bulleted Summary"}
                  </span>
                </button>
              </div>

              {generatedSummary && (
                <div className="pt-4 border-t border-purple-950/15">
                  <div className="bg-[#101117] border border-purple-950/20 rounded-xl p-5 text-sm leading-relaxed text-[#c5c6c7] whitespace-pre-line">
                    <span className="font-bold text-white block mb-3 border-b border-purple-950/10 pb-1.5">
                      Executive Digest Summary:
                    </span>
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
                  <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">
                    Original Text
                  </label>
                  <textarea
                    rows={4}
                    value={translateText}
                    onChange={(e) => setTranslateText(e.target.value)}
                    className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-600/50 resize-none leading-relaxed"
                  ></textarea>
                </div>
                <div>
                  <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">
                    Target Language
                  </label>
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
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                <span>
                  {loading
                    ? "Translating context..."
                    : "Run LingoFlow Translation"}
                </span>
              </button>

              {translatedResult && (
                <div className="pt-4 border-t border-purple-950/15">
                  <div className="bg-[#101117] border border-purple-950/20 rounded-xl p-5 text-sm leading-relaxed text-emerald-400 font-mono">
                    <span className="font-bold text-white block mb-2 text-xs font-sans">
                      Polyglot Translated Output:
                    </span>
                    {translatedResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Business Analyzer Active */}
          {activeTool === "strategy" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">
                  Business idea or product concept
                </label>

                <textarea
                  rows={5}
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-600/50 resize-y leading-relaxed"
                />
              </div>

              <button
                onClick={runBusinessAnalyzer}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-30 shadow"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
                <span>{loading ? "Analyzing..." : "Analyze Business"}</span>
              </button>

              {businessResult && (
                <div className="pt-4 border-t border-purple-950/15">
                  <div className="bg-[#101117] border border-purple-950/20 rounded-xl p-5 text-sm leading-relaxed text-[#c5c6c7] whitespace-pre-line">
                    <span className="font-bold text-white block mb-3 border-b border-purple-950/10 pb-1.5">
                      Business Opportunity Report:
                    </span>
                    {businessResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image Prompter Active */}
          {activeTool === "prompter" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs text-[#8b8e99] block mb-2 font-semibold">
                  Describe the image you want to create
                </label>

                <textarea
                  rows={6}
                  value={imagePromptInput}
                  onChange={(e) => setImagePromptInput(e.target.value)}
                  className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-600/50 resize-y leading-relaxed"
                />
              </div>

              {imageError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                  {imageError}
                </div>
              )}

              <button
                onClick={runImagePrompter}
                disabled={loading || !imagePromptInput.trim()}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-30 shadow"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                <span>
                  {loading ? "Generating image..." : "Generate Image"}
                </span>
              </button>

              {loading && (
                <div className="rounded-2xl border border-purple-950/30 bg-[#101117] p-5 text-xs text-[#8b8e99]">
                  ALVIRA is enhancing your prompt and generating the image
                  preview...
                </div>
              )}

              {imagePromptResult && (
                <div className="rounded-2xl border border-purple-950/30 bg-[#101117] p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="font-bold text-white">
                      Generated Image Prompt
                    </h3>

                    <button
                      onClick={copyImagePrompt}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#16171f] border border-purple-950/30 text-xs text-white hover:border-purple-600/50"
                    >
                      {copiedImagePrompt ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copiedImagePrompt ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
                    {imagePromptResult}
                  </pre>
                </div>
              )}

              {generatedImageUrl && (
                <div className="rounded-2xl border border-purple-950/30 bg-[#101117] p-6">
                  <span className="font-bold text-white block mb-4">
                    Generated Image Preview
                  </span>

                  <img
                    src={generatedImageUrl}
                    alt="Generated preview"
                    className="w-full max-w-xl rounded-2xl border border-purple-950/30 shadow"
                  />

                  <div className="flex flex-wrap gap-3 mt-4">
                    <a
                      href={generatedImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:opacity-90"
                    >
                      Open Image
                    </a>

                    <button
                      onClick={downloadGeneratedImage}
                      className="inline-flex px-4 py-2 rounded-xl bg-[#16171f] border border-purple-950/30 text-white text-xs font-bold hover:border-purple-600/50"
                    >
                      Download
                    </button>

                    <button
                      onClick={runImagePrompter}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16171f] border border-purple-950/30 text-white text-xs font-bold hover:border-purple-600/50 disabled:opacity-30"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                  </div>
                </div>
              )}

              {imageHistory.length > 0 && (
                <SectionCard className="p-6">
                  <h3 className="font-bold text-white mb-4">
                    Recent Generations
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {imageHistory.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-purple-950/20 bg-[#16171f] p-3"
                      >
                        <img
                          src={item.imageUrl}
                          alt="Image history preview"
                          className="w-full h-40 object-cover rounded-lg border border-purple-950/20"
                        />

                        <p className="text-[10px] text-[#8b8e99] mt-3">
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          })}
                        </p>

                        <p className="text-xs text-[#c5c6c7] mt-2 line-clamp-3">
                          {item.prompt}
                        </p>

                        <button
                          onClick={() => {
                            if (confirm("Delete this image from history?")) {
                              deleteMutation.mutate(item.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="mt-3 flex items-center justify-center w-9 h-9 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                          title="Delete image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
