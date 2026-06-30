import React, { useState } from "react";
import {
  User,
  Shield,
  Eye,
  BrainCircuit,
  Save,
  Laptop,
  Smartphone,
  CheckCircle2,
  Moon,
  Sun,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { UserProfile, SessionDevice } from "../types";

interface SettingsTabProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export default function SettingsTab({ user, setUser }: SettingsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "sessions" | "appearance" | "ai">("profile");
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileBio, setProfileBio] = useState(user.bio);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Custom System instructions that the user can personalize
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Alvira AI, an elegant and professional AI productivity assistant. Your response should be insightful, clear, and perfectly formatted in markdown."
  );

  const [sessions, setSessions] = useState<SessionDevice[]>([
    { id: "1", device: "Chrome on MacOS Sonoma", location: "San Francisco, USA", active: true, type: "desktop" },
    { id: "2", device: "Alvira App on iPhone 15 Pro", location: "San Francisco, USA", active: false, type: "mobile" },
    { id: "3", device: "Safari on iPad Pro", location: "Oakland, USA", active: false, type: "mobile" },
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: profileName,
      email: profileEmail,
      bio: profileBio,
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleTheme = (themeMode: "light" | "dark" | "system") => {
    setUser((prev) => ({ ...prev, theme: themeMode }));

    const root = document.documentElement;
    const bodyContainer = document.getElementById("landing-container");

    if (themeMode === "dark") {
      root.classList.add("dark");
      document.body.style.backgroundColor = "#0b0c10";
    } else if (themeMode === "light") {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#fafafa";
    } else {
      // System defaults to dark in our premium workspace
      root.classList.add("dark");
    }
  };

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const menuItems = [
    { id: "profile", label: "Personal Information", icon: <User className="w-4 h-4" /> },
    { id: "sessions", label: "Active Sessions", icon: <Shield className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance Preferences", icon: <Eye className="w-4 h-4" /> },
    { id: "ai", label: "AI Model Customization", icon: <BrainCircuit className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0c10] text-[#c5c6c7] p-8 font-sans selection:bg-purple-600 selection:text-white" id="settings-tab">
      <div className="max-w-4xl bg-[#16171f] border border-purple-950/15 rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Left Side Submenu */}
        <div className="w-full md:w-56 bg-[#0f1016]/90 border-r border-purple-950/15 p-4 flex flex-col gap-1 shrink-0">
          <span className="text-[10px] text-[#8b8e99] font-mono tracking-wider font-bold p-2 uppercase">Account settings</span>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSubTab(item.id as any);
                setSaveSuccess(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 transition-all ${
                activeSubTab === item.id
                  ? "bg-purple-950/30 text-white border-l-2 border-purple-500"
                  : "text-[#8b8e99] hover:bg-purple-950/5 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side Workstation */}
        <div className="flex-1 p-6 md:p-8">
          {/* Save alert banner */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Workspace preferences successfully updated and synced with server node.</span>
            </div>
          )}

          {/* Profile form Tab */}
          {activeSubTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <h2 className="text-base font-bold text-white border-b border-purple-950/10 pb-2">Personal Information</h2>

              <div className="flex items-center gap-4 py-2">
                <img
                  src={user.avatarUrl}
                  alt="Profile portrait"
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-600/30 shadow-lg"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => alert("Avatar modification requires Alvira-Enterprise SSO configuration.")}
                    className="px-3.5 py-1.5 bg-[#101117] border border-purple-950/40 rounded-lg text-xs font-semibold hover:bg-purple-950/20 text-white transition-colors"
                  >
                    Change Picture
                  </button>
                  <p className="text-[10px] text-[#8b8e99] mt-1">Supports PNG, JPG up to 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#8b8e99] block mb-1.5 font-bold uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-3.5 text-xs text-white outline-none focus:border-purple-600/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8b8e99] block mb-1.5 font-bold uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-3.5 text-xs text-white outline-none focus:border-purple-600/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8b8e99] block mb-1.5 font-bold uppercase tracking-wider">Professional Biography</label>
                <textarea
                  rows={4}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-3.5 text-xs text-white outline-none focus:border-purple-600/50 resize-none leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:opacity-95 shadow transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </form>
          )}

          {/* Active Sessions Tab */}
          {activeSubTab === "sessions" && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white border-b border-purple-950/10 pb-2">Active Security Sessions</h2>
              <p className="text-xs text-[#8b8e99] font-light leading-relaxed">
                You are currently logged into Alvira AI across the following devices. Revoking unauthorized sessions instantly terminates operational cookies.
              </p>

              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-[#101117] rounded-xl border border-purple-950/15 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#16171f] rounded-lg border border-purple-950/10">
                        {session.type === "desktop" ? (
                          <Laptop className="w-5 h-5 text-purple-400" />
                        ) : (
                          <Smartphone className="w-5 h-5 text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">
                          {session.device}
                        </span>
                        <span className="text-[10px] text-[#8b8e99] block mt-1 font-light">
                          {session.location} • {session.active ? "Current Device" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {session.active ? (
                      <span className="px-2 py-0.5 bg-emerald-950/20 border border-emerald-500/30 text-[9px] font-mono font-bold text-emerald-400 rounded uppercase">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-[10px] font-semibold text-red-400 hover:text-red-300 transition-colors"
                      >
                        Terminate Session
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeSubTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white border-b border-purple-950/10 pb-2">Appearance Customization</h2>
              <p className="text-xs text-[#8b8e99] font-light leading-relaxed">
                Choose a visual theme fitting your lighting preferences. Alvira utilizes fluid Tailwind variables supporting both high-contrast light and absolute twilight dark states.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Dark Mode option */}
                <button
                  type="button"
                  onClick={() => handleToggleTheme("dark")}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all ${
                    user.theme === "dark"
                      ? "bg-purple-950/10 border-purple-500 text-white"
                      : "bg-[#101117] border-purple-950/30 text-[#8b8e99] hover:text-white hover:border-purple-950/50"
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  <div>
                    <span className="text-xs font-bold block">Twilight Dark</span>
                    <span className="text-[9px] block mt-1 font-light">Eye-strain reducer (Default)</span>
                  </div>
                </button>

                {/* Light Mode option */}
                <button
                  type="button"
                  onClick={() => handleToggleTheme("light")}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all ${
                    user.theme === "light"
                      ? "bg-purple-100 border-purple-600 text-purple-950 shadow"
                      : "bg-[#101117] border-purple-950/30 text-[#8b8e99] hover:text-white hover:border-purple-950/50"
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="text-xs font-bold block">Paper Light</span>
                    <span className="text-[9px] block mt-1 font-light">Crisp, readable high-contrast</span>
                  </div>
                </button>

                {/* System Mode option */}
                <button
                  type="button"
                  onClick={() => handleToggleTheme("system")}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all ${
                    user.theme === "system"
                      ? "bg-purple-950/10 border-purple-500 text-white"
                      : "bg-[#101117] border-purple-950/30 text-[#8b8e99] hover:text-white hover:border-purple-950/50"
                  }`}
                >
                  <Laptop className="w-5 h-5" />
                  <div>
                    <span className="text-xs font-bold block">Match System</span>
                    <span className="text-[9px] block mt-1 font-light">Follow OS settings</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* AI Settings Tab */}
          {activeSubTab === "ai" && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white border-b border-purple-950/10 pb-2">AI Agent Customization</h2>
              <p className="text-xs text-[#8b8e99] font-light leading-relaxed font-sans">
                Fine-tune how Alvira responds to your requests. The System Prompt defined below acts as the core instruction directive for all subsequent reasoning turns.
              </p>

              <div>
                <label className="text-[10px] text-[#8b8e99] block mb-1.5 font-bold uppercase tracking-wider">System Instruction Prompt</label>
                <textarea
                  rows={4}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-[#101117] border border-purple-950/40 rounded-xl p-3.5 text-xs text-white outline-none focus:border-purple-600/50 resize-none font-mono leading-relaxed"
                ></textarea>
              </div>

              <div className="p-4 bg-purple-950/25 border border-purple-500/25 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-[10px] text-purple-300 leading-relaxed font-light">
                  <span className="font-bold block mb-0.5">Prompt Tuning Guidelines:</span>
                  Adding directives like &ldquo;Always return bullet points&rdquo; or &ldquo;Maintain an analytical computer science tone&rdquo; optimizes code output. Changes are written straight to your secure browser session cache.
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2500);
                }}
                className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:opacity-95 shadow transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Agent Directives</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
