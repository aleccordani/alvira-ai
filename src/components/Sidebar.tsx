import React from "react";
import { logoText } from "../assets/branding";
import {
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
  FolderKanban,
  BarChart3,
  Trash2,
} from "lucide-react";
import { UserProfile, ChatSession } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
  onNewChat: () => void;
  chatSessions: ChatSession[];
  activeSessionId: string;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  onNewChat,
  chatSessions,
  activeSessionId,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4.5 h-4.5" />,
    },
    {
      id: "chat",
      label: "AI Chat",
      icon: <MessageSquare className="w-4.5 h-4.5" />,
    },
    {
      id: "tools",
      label: "AI Tools",
      icon: <FolderKanban className="w-4.5 h-4.5" />,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="w-4.5 h-4.5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4.5 h-4.5" />,
    },
  ];

  return (
    <div className="w-64 bg-[#0d0e14] border-r border-purple-950/25 flex flex-col h-screen overflow-hidden text-[#c5c6c7] shrink-0 font-sans select-none">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-6 pt-6 pb-5 flex justify-center">
          <img
            src={logoText}
            alt="Alvira AI"
            className="h-14 w-auto object-contain"
            draggable={false}
          />
        </div>

        <div className="px-4 mb-5">
          <button
            onClick={onNewChat}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-950/25 hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="px-3 mb-5">
          <p className="px-3 mb-2 text-[10px] text-[#666a78] uppercase tracking-widest font-bold">
            Recent Chats
          </p>

          <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide pr-1">
            {chatSessions.length === 0 ? (
              <p className="px-3 py-2 text-xs text-[#666a78]">No chats yet.</p>
            ) : (
              chatSessions.map((session) => {
                const isActive =
                  activeSessionId === session.id && activeTab === "chat";

                return (
                  <div
                    key={session.id}
                    className={`group relative rounded-xl transition-all ${
                      isActive
                        ? "bg-purple-950/35 text-white border border-purple-500/20"
                        : "hover:bg-purple-950/10 text-[#c5c6c7]"
                    }`}
                  >
                    <button
                      onClick={() => onSelectChat(session.id)}
                      className="w-full px-3 py-2.5 pr-9 text-left"
                    >
                      <span className="block text-xs font-semibold truncate">
                        {session.title || "New Chat"}
                      </span>
                      <span className="block text-[10px] text-[#8b8e99] truncate mt-0.5">
                        {session.lastMessage || "Open conversation"}
                      </span>
                    </button>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteChat(session.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#8b8e99] opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-950/20 transition"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="px-3 space-y-1 pb-5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-4 py-3 rounded-xl flex items-center gap-3.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-purple-950/30 border-l-2 border-purple-500 text-white shadow-inner"
                    : "hover:bg-purple-950/5 hover:text-white"
                }`}
              >
                <div
                  className={isActive ? "text-purple-400" : "text-[#8b8e99]"}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-purple-950/15">
        <div className="mb-4 bg-gradient-to-br from-purple-950/45 to-[#16171f] border border-purple-950/50 p-3 rounded-xl flex items-center justify-between shadow-md">
          <div>
            <span className="text-[9px] text-purple-400 font-mono tracking-widest uppercase font-semibold block">
              Active Tier
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {user.plan === "Free"
                ? "Starter Tier"
                : user.plan === "Pro"
                  ? "Pro Studio"
                  : "Enterprise"}
            </span>
          </div>

          <div className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg text-[10px] font-semibold text-purple-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-300 animate-pulse" />
            <span>
              {user.plan === "Free"
                ? "Lite"
                : user.plan === "Pro"
                  ? "PRO"
                  : "TEAM"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 bg-[#12131a] rounded-xl border border-purple-950/10 mb-4">
          <img
            src={user.avatarUrl}
            alt="User profile avatar"
            className="w-10 h-10 rounded-full object-cover border border-purple-500/20"
          />
          <div className="truncate flex-1">
            <span className="text-xs font-bold text-white block leading-tight truncate">
              {user.name}
            </span>
            <span className="text-[10px] text-[#8b8e99] block leading-tight truncate mt-0.5">
              {user.email}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => alert("Welcome to Alvira AI Help Desk!")}
            className="w-full px-4 py-2 rounded-lg text-xs font-medium text-[#8b8e99] hover:bg-purple-950/5 hover:text-white transition flex items-center gap-2.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help Desk</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full px-4 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/10 transition flex items-center gap-2.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
