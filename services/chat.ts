import api from "./api";

export const sendChat = async (conversationId: string, content: string) => {
  const response = await api.post("/chat", {
    conversationId,
    content,
  });

  return response.data;
};
