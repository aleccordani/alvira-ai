import React from "react";
import {
  Sparkles,
  MessageSquare,
  BookOpen,
  Code2,
  TrendingUp,
  Clock,
  ArrowRight,
  Gauge,
  Cpu,
  ChevronRight,
  Globe,
  Palette,
} from "lucide-react";
import { UserProfile, ChatSession } from "../types";

interface DashboardTabProps {
  user: UserProfile;
  recentChats: ChatSession[];
  onSelectChat: (chatId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onPreFillPrompt: (prompt: string) => void;
}

export default function DashboardTab({
  user,
  recentChats,
  onSelectChat,
  onNavigateToTab,
  onPreFillPrompt,
}: DashboardTabProps) {
  // Mock data matching screenshots or custom values
  const popularTools = [
    { id: "lingoflow", name: "LingoFlow", desc: "Polyglot translation suite", icon: <Globe className="w-5 h-5 text-blue-400" /> },
    { id: "canvas", name: "Canvas AI", desc: "Interactive vector design assistant", icon: <Palette className="w-5 h-5 text-pink-400" /> },
    { id: "devpilot", name: "DevPilot", desc: "Type-safe structural code engineering", icon: <Code2 className="w-5 h-5 text-emerald-400" /> },
    { id: "market", name: "Market Predictor", desc: "Analyze telemetry logs & spreadsheets", icon: <Cpu className="w-5 h-5 text-purple-400" /> },
  ];

  const suggestedPrompts = [
    "Refactor a Node.js Express server into bundled TypeScript using esbuild",
    "Analyze website telemetry logs and summarize the top three dropoff points",
    "Draft a professional corporate security framework for local files storage",
    "Translate technical onboarding markdown into Spanish and German",
  ];

  const quotaPercent = Math.round((user.tokensUsed / user.tokensLimit) * 100);

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0c10] text-[#c5c6c7] p-8 font-sans selection:bg-purple-600 selection:text-white" id="dashboard-tab">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{user.name}</span>
          </h1>
          <p className="text-xs text-[#8b8e99] mt-1.5 font-light">
            You are running on **Alvira Pro** workspace. Let&apos;s automate your tasks today.
          </p>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-purple-950/20 border border-purple-500/10 rounded-lg text-xs font-semibold text-purple-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Model Active: Alvira-Pro
          </div>
        </div>
      </div>

      {/* Quick Action Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Card 1: New Chat */}
        <button
          onClick={() => onNavigateToTab("chat")}
          className="bg-[#16171f] hover:bg-[#1a1c27] p-5 rounded-2xl border border-purple-950/20 text-left transition group relative overflow-hidden"
        >
          <div className="p-3 bg-purple-950/40 w-fit rounded-xl mb-4 text-purple-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Ask Anything</h3>
          <p className="text-xs text-[#8b8e99] mt-1 leading-relaxed">
            Start a custom conversation about marketing briefs, system architectures, or code scripts.
          </p>
          <span className="absolute bottom-5 right-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        {/* Card 2: Summarize Document */}
        <button
          onClick={() => {
            onNavigateToTab("tools");
            setTimeout(() => {
              const el = document.getElementById("tool-summarizer");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="bg-[#16171f] hover:bg-[#1a1c27] p-5 rounded-2xl border border-purple-950/20 text-left transition group relative overflow-hidden"
        >
          <div className="p-3 bg-indigo-950/40 w-fit rounded-xl mb-4 text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Summarize Doc</h3>
          <p className="text-xs text-[#8b8e99] mt-1 leading-relaxed">
            Feed in text logs or technical documentation and receive an instant bulleted, readable digest.
          </p>
          <span className="absolute bottom-5 right-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        {/* Card 3: Refactor Code */}
        <button
          onClick={() => {
            onNavigateToTab("tools");
            setTimeout(() => {
              const el = document.getElementById("tool-coder");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="bg-[#16171f] hover:bg-[#1a1c27] p-5 rounded-2xl border border-purple-950/20 text-left transition group relative overflow-hidden"
        >
          <div className="p-3 bg-emerald-950/40 w-fit rounded-xl mb-4 text-emerald-400">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Generate Code</h3>
          <p className="text-xs text-[#8b8e99] mt-1 leading-relaxed">
            Synthesize optimized software components, write API endpoints, or write test files in 30+ languages.
          </p>
          <span className="absolute bottom-5 right-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bento Cell 1: Usage stats */}
        <div className="lg:col-span-2 bg-[#16171f] border border-purple-950/15 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white tracking-tight mb-6 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-400" /> Resource Allocation Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Tokens Used Radial Meter */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG Radial Progress dial */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#1b1c25"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="url(#purpleGradient)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={326.7}
                    strokeDashoffset={326.7 - (326.7 * quotaPercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold text-white leading-none">
                    {quotaPercent}%
                  </span>
                  <span className="text-[10px] text-[#8b8e99] font-mono mt-1 uppercase">Quota Used</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-white mt-4">
                {(user.tokensUsed / 1000).toFixed(0)}k / {(user.tokensLimit / 1000000).toFixed(1)}M Tokens
              </p>
              <p className="text-[10px] text-[#8b8e99] mt-1 font-light">Renews on July 24, 2026</p>
            </div>

            {/* Time Saved Meter */}
            <div className="flex flex-col items-center justify-center text-center p-4 bg-[#12131a] rounded-xl border border-purple-950/10 h-full">
              <div className="p-3 bg-indigo-950/30 rounded-xl text-indigo-400 mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">14.2 hrs</span>
              <span className="text-xs text-[#8b8e99] mt-1">Operational Time Saved</span>
              <div className="mt-2 text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +12% this week
              </div>
            </div>

            {/* Models called ratio */}
            <div className="flex flex-col items-center justify-center text-center p-4 bg-[#12131a] rounded-xl border border-purple-950/10 h-full">
              <div className="p-3 bg-emerald-950/30 rounded-xl text-emerald-400 mb-3">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">85 / 15</span>
              <span className="text-xs text-[#8b8e99] mt-1">Pro vs Standard Calls</span>
              <p className="text-[10px] text-[#8b8e99] mt-2 font-light">Focusing on high-end reasoning</p>
            </div>
          </div>
        </div>

        {/* Bento Cell 2: Recent Conversations */}
        <div className="bg-[#16171f] border border-purple-950/15 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight mb-4 flex items-center justify-between">
              <span>Recent Conversations</span>
              <button onClick={() => onNavigateToTab("chat")} className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                View All
              </button>
            </h2>

            <div className="space-y-3">
              {recentChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className="w-full p-3 bg-[#101117] hover:bg-[#1c1d29] rounded-xl border border-purple-950/10 flex items-center justify-between group text-left transition"
                >
                  <div className="truncate pr-4 flex-1">
                    <span className="text-xs font-bold text-white block truncate leading-tight group-hover:text-purple-300 transition-colors">
                      {chat.title}
                    </span>
                    <span className="text-[10px] text-[#8b8e99] block mt-1 truncate max-w-xs font-light">
                      {chat.lastMessage}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8b8e99] group-hover:text-white transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-purple-950/10 mt-4 text-center">
            <span className="text-[10px] text-[#8b8e99] font-light">Conversations are synced and persistent locally</span>
          </div>
        </div>
      </div>

      {/* Popular AI Tools Grid */}
      <div className="bg-[#16171f] border border-purple-950/15 rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-bold text-white tracking-tight mb-5">Popular AI Tools Workspace</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => {
                onNavigateToTab("tools");
                setTimeout(() => {
                  const targetEl = document.getElementById(`tool-${tool.id}`);
                  if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="p-4 bg-[#101117] hover:bg-[#1a1c27] rounded-xl border border-purple-950/15 flex items-center gap-3.5 group cursor-pointer transition"
            >
              <div className="p-2.5 bg-[#16171f] rounded-lg group-hover:bg-purple-950/20 transition-colors">
                {tool.icon}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block group-hover:text-purple-300 transition-colors">
                  {tool.name}
                </span>
                <span className="text-[10px] text-[#8b8e99] block mt-0.5 truncate max-w-[140px] font-light">
                  {tool.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Prompts section */}
      <div className="bg-gradient-to-r from-purple-950/10 to-[#16171f] border border-purple-950/20 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white tracking-tight mb-4 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" /> Suggested Prompts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onPreFillPrompt(prompt)}
              className="text-left p-3.5 bg-[#101117]/80 hover:bg-[#161720] rounded-xl border border-purple-950/10 text-xs font-medium text-[#c5c6c7] hover:text-white hover:border-purple-800/20 transition flex items-center justify-between group"
            >
              <span className="truncate pr-4 max-w-xs md:max-w-md">{prompt}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8b8e99] group-hover:translate-x-0.5 group-hover:text-purple-400 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
