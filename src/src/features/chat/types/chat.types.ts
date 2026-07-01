export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UploadedFile {
  file: File;
  previewUrl?: string;
  type: "image" | "pdf";
}

export interface SendMessagePayload {
  conversationId?: string;
  message: string;
  file?: File | null;
}