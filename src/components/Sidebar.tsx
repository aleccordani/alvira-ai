import React, { useEffect, useState } from "react";
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
  Pencil,
  BrainCircuit,
  ShieldCheck,
  CreditCard,
  X,
} from "lucide-react";
import { UserProfile, ChatSession } from "../types";
import { useQuery } from "@tanstack/react-query";
import { billingService } from "../modules/billing/services/billing.service";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  isAdmin: boolean;
  onLogout: () => void;
  onNewChat: () => void;
  chatSessions: ChatSession[];
  activeSessionId: string;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, title: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  isAdmin,
  onLogout,
  onNewChat,
  chatSessions,
  activeSessionId,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  isOpen,
  onClose,
}: SidebarProps) {
  const { data: billing } = useQuery({
    queryKey: ["billing"],
    queryFn: billingService.getMyBilling,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
    },
    {
      id: "chat",
      label: "AI Chat",
      icon: <MessageSquare className="h-[18px] w-[18px]" />,
    },
    {
      id: "billing",
      label: "Billing",
      icon: <CreditCard className="h-[18px] w-[18px]" />,
    },
    {
      id: "workspace",
      label: "Workspace AI",
      icon: <BrainCircuit className="h-[18px] w-[18px]" />,
    },
    {
      id: "tools",
      label: "AI Tools",
      icon: <FolderKanban className="h-[18px] w-[18px]" />,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-[18px] w-[18px]" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-[18px] w-[18px]" />,
    },
  ];

  if (isAdmin) {
    menuItems.push({
      id: "admin",
      label: "Admin Console",
      icon: <ShieldCheck className="h-[18px] w-[18px]" />,
    });
  }

  const currentPlanType = billing?.plan.type ?? "FREE";

  const filteredChats = chatSessions.filter((session) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return true;

    return (
      session.title.toLowerCase().includes(keyword) ||
      session.lastMessage.toLowerCase().includes(keyword)
    );
  });

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  const handleCreateChat = () => {
    onNewChat();
    onClose();
  };

  const handleSelectConversation = (chatId: string) => {
    onSelectChat(chatId);
    onClose();
  };

  const handleLogoutClick = () => {
    onClose();
    onLogout();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[min(18rem,86vw)] shrink-0 select-none flex-col overflow-hidden bg-[#0d0e14] font-sans text-[#c5c6c7] shadow-2xl transition-transform duration-300 ease-out md:static md:z-auto md:h-screen md:w-64 md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-purple-900/25 bg-[#15161e] text-[#8b8e99] transition hover:border-purple-500/40 hover:text-white md:hidden"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          <div className="flex justify-center px-6 pb-5 pt-6">
            <img
              src={logoText}
              alt="Alvira AI"
              className="h-14 w-auto object-contain"
              draggable={false}
            />
          </div>

          <div className="mb-5 px-4">
            <button
              type="button"
              onClick={handleCreateChat}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/25 transition-all hover:opacity-90"
            >
              <MessageSquare className="h-[18px] w-[18px]" />
              <span>New Chat</span>
            </button>
          </div>

          <div className="mb-5 px-3">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#666a78]">
              Recent Chats
            </p>

            <div className="mb-3 px-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-lg border border-purple-900/20 bg-[#12131a] px-3 py-2 text-xs text-white outline-none placeholder:text-[#666] focus:border-purple-500"
              />
            </div>

            <div className="max-h-64 space-y-1 overflow-y-auto pr-1 scrollbar-hide">
              {chatSessions.length === 0 ? (
                <p className="px-3 py-2 text-xs text-[#666a78]">
                  No chats yet.
                </p>
              ) : filteredChats.length === 0 ? (
                <p className="px-3 py-2 text-xs text-[#666a78]">
                  No conversations found.
                </p>
              ) : (
                filteredChats.map((session) => {
                  const isActive =
                    activeSessionId === session.id && activeTab === "chat";

                  const isEditing = editingId === session.id;

                  return (
                    <div
                      key={session.id}
                      className={`group relative rounded-xl transition-all ${
                        isActive
                          ? "border border-purple-500/20 bg-purple-950/35 text-white"
                          : "text-[#c5c6c7] hover:bg-purple-950/10"
                      }`}
                    >
                      {isEditing ? (
                        <div className="px-3 py-2.5 pr-9">
                          <input
                            autoFocus
                            value={editingTitle}
                            onChange={(event) =>
                              setEditingTitle(event.target.value)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                onRenameChat(session.id, editingTitle);
                                setEditingId(null);
                              }

                              if (event.key === "Escape") {
                                setEditingId(null);
                              }
                            }}
                            onBlur={() => setEditingId(null)}
                            className="w-full rounded-lg border border-purple-500/30 bg-[#0d0e14] px-2 py-1 text-xs text-white outline-none"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectConversation(session.id)}
                          className="w-full px-3 py-2.5 pr-16 text-left"
                        >
                          <span className="block truncate text-xs font-semibold">
                            {session.title || "New Chat"}
                          </span>

                          <span className="mt-0.5 block truncate text-[10px] text-[#8b8e99]">
                            {session.lastMessage || "Open conversation"}
                          </span>
                        </button>
                      )}

                      {!isEditing && (
                        <>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setEditingId(session.id);
                              setEditingTitle(session.title || "New Chat");
                            }}
                            className="absolute right-8 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8b8e99] opacity-100 transition hover:bg-purple-950/20 hover:text-purple-300 md:opacity-0 md:group-hover:opacity-100"
                            title="Rename conversation"
                            aria-label="Rename conversation"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onDeleteChat(session.id);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8b8e99] opacity-100 transition hover:bg-red-950/20 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100"
                            title="Delete conversation"
                            aria-label="Delete conversation"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-1 px-3 pb-5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? "border-l-2 border-purple-500 bg-purple-950/30 text-white shadow-inner"
                      : "text-[#8b8e99] hover:bg-purple-950/10 hover:text-white"
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

        <div className="shrink-0 border-t border-purple-950/15 p-4">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-purple-950/50 bg-gradient-to-br from-purple-950/45 to-[#16171f] p-3 shadow-md">
            <div>
              <span className="block font-mono text-[9px] font-semibold uppercase tracking-widest text-purple-400">
                Active Tier
              </span>

              <span className="mt-0.5 block text-xs font-bold text-white">
                {currentPlanType === "FREE"
                  ? "Starter Tier"
                  : currentPlanType === "PRO"
                    ? "Pro Studio"
                    : "Team"}
              </span>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-600/20 px-2 py-1 text-[10px] font-semibold text-purple-300">
              <Sparkles className="h-3 w-3 animate-pulse text-purple-300" />

              <span>
                {currentPlanType === "FREE"
                  ? "LITE"
                  : currentPlanType === "PRO"
                    ? "PRO"
                    : "TEAM"}
              </span>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-xl border border-purple-950/10 bg-[#12131a] p-2">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="User profile avatar"
                className="h-10 w-10 shrink-0 rounded-full border border-purple-500/20 object-cover"
              />
            ) : (
              <div className="h-10 w-10 shrink-0 rounded-full border border-purple-500/20 bg-purple-950/30" />
            )}

            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold leading-tight text-white">
                {user.name || "ALVIRA User"}
              </span>

              <span className="mt-0.5 block truncate text-[10px] leading-tight text-[#8b8e99]">
                {user.email}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => alert("Welcome to Alvira AI Help Desk!")}
              className="flex w-full items-center gap-2.5 rounded-lg px-4 py-2 text-xs font-medium text-[#8b8e99] transition hover:bg-purple-950/5 hover:text-white"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help Desk</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="flex w-full items-center gap-2.5 rounded-lg px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-950/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
