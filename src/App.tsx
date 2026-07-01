import React, { useEffect, useState } from "react";
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
import {
  createConversation,
  getConversation,
  getConversations,
  deleteConversation,
  renameConversation,
} from "../services/conversation";
import { getToken, removeToken } from "../lib/token";

export default function App() {
  const [viewState, setViewState] = useState<
    "landing" | "auth" | "pricing" | "workspace"
  >("landing");

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [preFilledPrompt, setPreFilledPrompt] = useState("");

  const [user, setUser] = useState<UserProfile>({
    name: "Alec",
    email: "alec@gmail.com",
    bio: "Alvira AI User",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alec",
    plan: "Pro",
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
      const token = getToken();

      if (!token) {
        setChatSessions([]);
        setActiveSessionId("");
        return;
      }

      const currentActiveId = activeSessionId;

      const response = await getConversations(token);
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
    const token = getToken();

    if (token) {
      setViewState("workspace");
      setActiveTab("dashboard");
    }
  }, []);

  useEffect(() => {
    if (viewState === "workspace") {
      loadConversations();
    }
  }, [viewState]);

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
      const conversation = response.data || response.data?.data;

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
    } catch (error) {
      console.error("Failed to create conversation:", error);
      alert("Failed to create new chat.");
    }
  };

  const handleSelectChat = async (chatId: string) => {
    try {
      setActiveSessionId(chatId);
      setActiveTab("chat");

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

  const handleLogout = () => {
    removeToken();
    setChatSessions([]);
    setActiveSessionId("");
    setViewState("landing");
    setActiveTab("dashboard");
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
      alert("Failed to delete conversation.");
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
      alert("Failed to rename conversation.");
    }
  };

  if (viewState === "landing") {
    return (
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
    );
  }

  if (viewState === "auth") {
    return (
      <AuthPage
        initialMode={authMode}
        onBack={() => setViewState("landing")}
        onSuccess={(updatedUser) => {
          setUser((prev) => ({
            ...prev,
            ...updatedUser,
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
    );
  }

  if (viewState === "pricing") {
    return (
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
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0c10]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onNewChat={handleNewChat}
        chatSessions={chatSessions}
        activeSessionId={activeSessionId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />

      <div className="flex-1 flex flex-col overflow-hidden h-full">
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
          />
        )}

        {activeTab === "tools" && <ToolsTab user={user} setUser={setUser} />}

        {activeTab === "analytics" && <AnalyticsTab />}

        {activeTab === "settings" && (
          <SettingsTab user={user} setUser={setUser} />
        )}
      </div>
    </div>
  );
}
