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
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
  onNewChat: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  onNewChat,
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
    <div className="w-64 bg-[#0d0e14] border-r border-purple-950/25 flex flex-col justify-between h-screen text-[#c5c6c7] shrink-0 font-sans select-none">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="px-6 pt-6 pb-5 flex justify-center">
          <img
            src={logoText}
            alt="Alvira AI"
            className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
            draggable={false}
          />
        </div>

        {/* Premium Badge Card */}
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-br from-purple-950/45 to-[#16171f] border border-purple-950/50 p-4 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-semibold block">
                Active Tier
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {user.plan === "Free"
                  ? "Starter Tier"
                  : user.plan === "Pro"
                    ? "Pro Studio"
                    : "Enterprise"}
              </span>
            </div>
            <div className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg text-xs font-semibold text-purple-300 flex items-center gap-1">
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
        </div>

        {/* Action Button: New Chat */}
        <div className="px-4 mb-6">
          <button
            onClick={onNewChat}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-950/25 hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 space-y-1">
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
                  className={`${isActive ? "text-purple-400" : "text-[#8b8e99]"}`}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-purple-950/15">
        {/* User Card */}
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

        {/* Help & Logout Buttons */}
        <div className="space-y-1">
          <button
            onClick={() =>
              alert(
                "Welcome to Alvira AI Help Desk! Here is how we can streamline your workflows: Use AI Chat to draft proposals, and the Specialized AI Tools workspace to analyze data or generate type-safe code scripts.",
              )
            }
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
