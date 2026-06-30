export interface ChatMessage {
  id: string;
  sender: "user" | "model";
  text: string;
  timestamp: string;
  image?: string;
  simulated?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: ChatMessage[];
  model: "Alvira-Pro" | "Alvira-1";
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  plan: "Free" | "Pro" | "Business";
  theme: "light" | "dark" | "system";
  tokensUsed: number;
  tokensLimit: number;
}

export interface SessionDevice {
  id: string;
  device: string;
  location: string;
  active: boolean;
  type: "desktop" | "mobile";
}

export interface AnalyticsMetric {
  date: string;
  tokens: number;
  timeSaved: number;
  requests: number;
}
