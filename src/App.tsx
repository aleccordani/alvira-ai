import React, { useState } from "react";
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

export default function App() {
  // Navigation Router: "landing" | "auth" | "pricing" | "workspace"
  const [viewState, setViewState] = useState<"landing" | "auth" | "pricing" | "workspace">("landing");
  // Default mode for AuthPage: "login" | "register"
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  // Active Workspace tab: "dashboard" | "chat" | "tools" | "analytics" | "settings"
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Injected prefilled prompt trigger state
  const [preFilledPrompt, setPreFilledPrompt] = useState("");

  // Main synchronized User profile object (corresponds to Slide 5 / profile metadata)
  const [user, setUser] = useState<UserProfile>({
    name: "Alex Rivera",
    email: "alex.rivera@alvira.ai",
    bio: "Principal Solutions Architect at TechFlow. Orchestrating cloud-native deployment pipelines, local vector document databases, and AI automation caches.",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgbYMLZXHUC_EfeCV6EOAjpI4TJ1IxaVaBX6hUTQh3ctsieIYxdHLCDdFPRUtuG7cArnxA8-51kklrwmKVOlA-9e3srz68gwhZEb69y_fdaKy2JOpK6SLqV1MDruOEO02_VvPKNPepYBZAXeqfD2wKr2x4O2pJ4QcuiDZD1Cpucs4jnzRDyTU3saIzEuTHiEUXbkHuU7flZMC2N4U6NGA_052JycXvda6q_orSLzxx-NjVg659XsGcICp_j5jelpo1gYgPEZWYMBpX",
    plan: "Pro",
    theme: "dark",
    tokensUsed: 124000,
    tokensLimit: 150000,
  });

  // Recent Chat Sessions state (pre-populated with high-fidelity threads from Slide 2)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "chat-1",
      title: "Q3 Marketing Strategy Research",
      lastMessage: "I have structured the bulleted analysis on competitor metrics.",
      timestamp: "10:15 AM",
      model: "Alvira-Pro",
      messages: [
        {
          id: "m1",
          sender: "user",
          text: "Can you outline competitor pricing structures for modern vector analytics databases?",
          timestamp: "10:12 AM",
        },
        {
          id: "m2",
          sender: "model",
          text: `Certainly! I have aggregated competitor pricing structures across prominent vector databases (Pinecone, Milvus, Qdrant):

### 1. Pinecone Serverless
* **Pricing model:** Read/Write capacity units (CU hours) and vector storage dimensions.
* **Average cost:** ~$0.05 per Million tokens/queries evaluated. Very efficient for sparse requests.

### 2. Milvus / Zilliz Cloud
* **Pricing model:** Continuous dedicated container instances.
* **Average cost:** Starts at $35/mo per small cluster node. Optimized for heavy, dense similarity indexing.

### 3. Qdrant Cloud
* **Pricing model:** Node based memory sizing starting at $19/mo.

Let me know if you would like me to synthesize a comparative market SWOT analysis on these platforms!`,
          timestamp: "10:15 AM",
          simulated: false,
        },
      ],
    },
    {
      id: "chat-2",
      title: "Python Script Refactoring",
      lastMessage: "Refactored the SQLite transaction block using decorator retries.",
      timestamp: "Yesterday",
      model: "Alvira-Pro",
      messages: [
        {
          id: "m3",
          sender: "user",
          text: "Refactor this Python connection to use retry decorator logic.",
          timestamp: "Yesterday",
        },
        {
          id: "m4",
          sender: "model",
          text: `I have successfully refactored your database connection script to utilize robust sqlite3 retry decorator wrappers:

\`\`\`python
import time
from functools import wraps
import sqlite3

def retry_on_locked(max_retries=3, delay=1.0):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except sqlite3.OperationalError as e:
                    if "database is locked" in str(e).lower():
                        retries += 1
                        if retries == max_retries:
                            raise e
                        time.sleep(delay)
                    else:
                        raise e
            return None
        return wrapper
    return decorator
\`\`\`

Let me know if we should implement this logic inside an Express Node.js server alternative!`,
          timestamp: "Yesterday",
          simulated: false,
        },
      ],
    },
    {
      id: "chat-3",
      title: "Newsletter Draft Summary",
      lastMessage: "Prepared bulleted digest of Q2 product pipeline releases.",
      timestamp: "June 25",
      model: "Alvira-1",
      messages: [],
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>("chat-1");

  // Get active session
  const activeSession = chatSessions.find((s) => s.id === activeSessionId) || null;

  const handleUpdateSessionMessages = (sessionId: string, messages: ChatMessage[]) => {
    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const lastMsg = messages[messages.length - 1];
          return {
            ...session,
            messages,
            lastMessage: lastMsg ? lastMsg.text : "Empty Conversation",
            timestamp: lastMsg ? lastMsg.timestamp : "Just Now",
          };
        }
        return session;
      })
    );
  };

  const handleNewChat = () => {
    const newSessionId = `chat-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: `Draft Session #${chatSessions.length + 1}`,
      lastMessage: "No messages yet.",
      timestamp: "Just Now",
      model: "Alvira-Pro",
      messages: [],
    };

    setChatSessions([newSession, ...chatSessions]);
    setActiveSessionId(newSessionId);
    setActiveTab("chat");
  };

  const handleSelectChat = (chatId: string) => {
    setActiveSessionId(chatId);
    setActiveTab("chat");
  };

  const handlePreFillPrompt = (prompt: string) => {
    setPreFilledPrompt(prompt);
    setActiveTab("chat");
  };

  // -------------------------------------------------------------
  // Router Renderer
  // -------------------------------------------------------------

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
            // Keep the selected plan if they had chosen one, or default to Pro
            plan: prev.plan || "Pro",
            tokensLimit: prev.plan === "Free" ? 100000 : prev.plan === "Business" ? 5000000 : 1500000,
            tokensUsed: updatedUser.name !== "Alex Rivera" ? 0 : 124000
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
            tokensLimit: plan === "Free" ? 100000 : plan === "Pro" ? 1500000 : 5000000,
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
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={() => {
          setViewState("landing");
          setActiveTab("dashboard");
        }}
        onNewChat={handleNewChat}
      />

      {/* Main Workspace transition panes */}
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
          />
        )}

        {activeTab === "tools" && (
          <ToolsTab
            user={user}
            setUser={setUser}
          />
        )}

        {activeTab === "analytics" && <AnalyticsTab />}

        {activeTab === "settings" && (
          <SettingsTab
            user={user}
            setUser={setUser}
          />
        )}
      </div>
    </div>
  );
}
