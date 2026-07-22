import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Toaster, toast } from "sonner";
import LandingPage from "./components/LandingPage";
import PricingPage from "./components/PricingPage";
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import DashboardTab from "./components/DashboardTab";
import ChatTab from "./components/ChatTab";
import ToolsTab from "./components/ToolsTab";
import AnalyticsTab from "./components/AnalyticsTab";
import SettingsTab from "./components/SettingsTab";
import { UserProfile, ChatSession, ChatMessage } from "./types";
import { AiTool } from "./services/chat";
import {
  createConversation,
  getConversation,
  getConversations,
  deleteConversation,
  renameConversation,
} from "./services/conversation";
import { getMeRequest, logoutRequest } from "./services/auth";
import { WorkspacePage } from "./modules/workspace";
import { BillingPage } from "./modules/billing";
import { AdminPage } from "./modules/admin";

export default function App() {
  const [viewState, setViewState] = useState<
    "landing" | "auth" | "pricing" | "workspace"
  >("landing");

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [preFilledPrompt, setPreFilledPrompt] = useState("");
  const [activeTool, setActiveTool] = useState<AiTool>("general");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    bio: "Alvira AI User",
    avatarUrl: "",
    plan: "Pro",
    role: "USER",
    theme: "dark",
    tokensUsed: 0,
    tokensLimit: 1500000,
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");

  const activeSession =
    chatSessions.find((session) => session.id === activeSessionId) || null;

  const mapBackendMessage = (message: any): ChatMessage => ({
    id: message.id,
    sender: message.role === "user" ? "user" : "model",
    text: message.content,
    timestamp: new Date(message.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const mapBackendConversation = (conversation: any): ChatSession => {
    const messages = conversation.messages || [];
    const lastMessage = messages[messages.length - 1];

    return {
      id: conversation.id,
      title: conversation.title || "New Chat",
      lastMessage: lastMessage ? lastMessage.content : "Open conversation",
      timestamp: conversation.updatedAt
        ? new Date(conversation.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Just Now",
      model: "Alvira-Pro",
      messages: messages.map(mapBackendMessage),
    };
  };

  const normalizeConversations = (response: any) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
  };

  const loadConversations = async () => {
    try {
      const response = await getConversations();
      const currentActiveId = activeSessionId;
      const conversations = normalizeConversations(response);

      const sessions: ChatSession[] = conversations.map((conversation: any) =>
        mapBackendConversation(conversation),
      );

      setChatSessions((prev) => {
        if (!currentActiveId) return sessions;

        const activeLocalSession = prev.find(
          (session) => session.id === currentActiveId,
        );

        if (!activeLocalSession) return sessions;

        return sessions.map((session) =>
          session.id === currentActiveId
            ? {
                ...session,
                messages:
                  activeLocalSession.messages.length > session.messages.length
                    ? activeLocalSession.messages
                    : session.messages,
              }
            : session,
        );
      });

      if (sessions.length > 0) {
        setActiveSessionId((currentId) => currentId || sessions[0].id);
      } else {
        setActiveSessionId("");
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await getMeRequest();
        const sessionUser = session?.user;

        if (!sessionUser) return;

        setUser((prev) => ({
          ...prev,
          name: sessionUser.name,
          email: sessionUser.email,
          role: sessionUser.role === "ADMIN" ? "ADMIN" : "USER",
          avatarUrl:
            sessionUser.image ??
            `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
              sessionUser.name,
            )}`,
        }));

        setViewState("workspace");
        setActiveTab("dashboard");
      } catch {
        setViewState("landing");
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (viewState === "workspace") {
      loadConversations();
    }
  }, [viewState]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "admin" && user.role !== "ADMIN") {
      setActiveTab("dashboard");
    }
  }, [activeTab, user.role]);

  const handleUpdateSessionMessages = (
    sessionId: string,
    messages: ChatMessage[],
  ) => {
    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        const lastMessage = messages[messages.length - 1];

        return {
          ...session,
          messages,
          lastMessage: lastMessage ? lastMessage.text : "Empty conversation",
          timestamp: lastMessage ? lastMessage.timestamp : "Just Now",
        };
      }),
    );
  };

  const handleNewChat = async () => {
    try {
      const response = await createConversation();
      const conversation = response.data ?? response.data?.data ?? response;

      const newSession: ChatSession = {
        id: conversation.id,
        title: conversation.title || "New Chat",
        lastMessage: "No messages yet.",
        timestamp: "Just Now",
        model: "Alvira-Pro",
        messages: [],
      };

      setChatSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setActiveTab("chat");
      setIsMobileSidebarOpen(false);

      return newSession.id;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Failed to create new chat.");
      return null;
    }
  };

  const handleSelectChat = async (chatId: string) => {
    try {
      setActiveSessionId(chatId);
      setActiveTab("chat");
      setIsMobileSidebarOpen(false);

      const response = await getConversation(chatId);
      const conversation = response.data || response.data?.data;
      const session = mapBackendConversation(conversation);

      setChatSessions((prev) =>
        prev.map((item) => (item.id === chatId ? session : item)),
      );
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const handlePreFillPrompt = (prompt: string) => {
    setPreFilledPrompt(prompt);
    setActiveTab("chat");
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } finally {
      setIsMobileSidebarOpen(false);
      setChatSessions([]);
      setActiveSessionId("");

      setUser((prev) => ({
        ...prev,
        name: "",
        email: "",
        avatarUrl: "",
      }));

      setViewState("landing");
      setActiveTab("dashboard");
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    const confirmed = confirm("Delete this conversation?");

    if (!confirmed) return;

    try {
      await deleteConversation(chatId);

      setChatSessions((prev) =>
        prev.filter((session) => session.id !== chatId),
      );

      if (activeSessionId === chatId) {
        setActiveSessionId("");
        setActiveTab("dashboard");
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast.error("Failed to delete conversation.");
    }
  };

  const handleRenameChat = async (chatId: string, title: string) => {
    const cleanTitle = title.trim();

    if (!cleanTitle) return;

    try {
      await renameConversation(chatId, cleanTitle);

      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === chatId ? { ...session, title: cleanTitle } : session,
        ),
      );
    } catch (error) {
      console.error("Failed to rename conversation:", error);
      toast.error("Failed to rename conversation.");
    }
  };

  if (viewState === "landing") {
    return (
      <>
        <Toaster richColors position="top-right" duration={2500} theme="dark" />

        <LandingPage
          onLogin={() => {
            setAuthMode("login");
            setViewState("auth");
          }}
          onRegister={() => {
            setAuthMode("register");
            setViewState("auth");
          }}
          onNavigateToPricing={() => setViewState("pricing")}
        />
      </>
    );
  }

  if (viewState === "auth") {
    return (
      <>
        <Toaster richColors position="top-right" duration={2500} theme="dark" />

        <AuthPage
          initialMode={authMode}
          onBack={() => setViewState("landing")}
          onSuccess={async (updatedUser) => {
            let role: "USER" | "ADMIN" = "USER";

            try {
              const session = await getMeRequest();

              if (session?.user?.role === "ADMIN") {
                role = "ADMIN";
              }
            } catch (error) {
              console.error("Failed to refresh user session:", error);
            }

            setUser((prev) => ({
              ...prev,
              ...updatedUser,
              role,
              plan: prev.plan || "Pro",
              tokensLimit:
                prev.plan === "Free"
                  ? 100000
                  : prev.plan === "Business"
                    ? 5000000
                    : 1500000,
              tokensUsed: 0,
            }));

            setViewState("workspace");
            setActiveTab("dashboard");
          }}
        />
      </>
    );
  }

  if (viewState === "pricing") {
    return (
      <>
        <Toaster richColors position="top-right" duration={2500} theme="dark" />

        <PricingPage
          onBack={() => setViewState("landing")}
          onSelectPlan={(plan) => {
            setUser((prev) => ({
              ...prev,
              plan,
              tokensLimit:
                plan === "Free" ? 100000 : plan === "Pro" ? 1500000 : 5000000,
              tokensUsed: plan === "Free" ? 12000 : 124000,
            }));

            setAuthMode("register");
            setViewState("auth");
          }}
        />
      </>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" duration={2500} theme="dark" />

      <div className="flex h-[100dvh] overflow-hidden bg-[#0b0c10]">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          isAdmin={user.role === "ADMIN"}
          onLogout={handleLogout}
          onNewChat={handleNewChat}
          chatSessions={chatSessions}
          activeSessionId={activeSessionId}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-purple-950/25 bg-[#0d0e14]/95 px-4 backdrop-blur md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-purple-900/25 bg-[#15161e] text-[#c5c6c7] transition hover:border-purple-500/40 hover:text-white"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="text-sm font-bold tracking-wide text-white">
              ALVIRA AI
            </span>

            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || "User"}
                className="h-9 w-9 rounded-full border border-purple-500/25 object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full border border-purple-500/25 bg-purple-950/30" />
            )}
          </header>

          <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
            {activeTab === "dashboard" && (
              <DashboardTab
                user={user}
                recentChats={chatSessions.slice(0, 3)}
                onSelectChat={handleSelectChat}
                onNavigateToTab={setActiveTab}
                onPreFillPrompt={handlePreFillPrompt}
              />
            )}

            {activeTab === "chat" && (
              <ChatTab
                user={user}
                setUser={setUser}
                activeSession={activeSession}
                onUpdateSessionMessages={handleUpdateSessionMessages}
                preFilledPrompt={preFilledPrompt}
                clearPreFilledPrompt={() => setPreFilledPrompt("")}
                onRefreshConversations={loadConversations}
                activeTool={activeTool}
                onCreateChat={handleNewChat}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === "tools" && (
              <ToolsTab
                user={user}
                setUser={setUser}
                onOpenToolChat={(tool) => {
                  setActiveTool(tool);
                  setPreFilledPrompt("");
                  setActiveTab("chat");
                }}
              />
            )}

            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "billing" && <BillingPage />}
            {activeTab === "admin" && user.role === "ADMIN" && <AdminPage />}

            {activeTab === "settings" && (
              <SettingsTab user={user} setUser={setUser} />
            )}

            {activeTab === "workspace" && <WorkspacePage />}
          </main>
        </div>
      </div>
    </>
  );
}
