import api from "./api";

export const getConversations = async (token: string) => {
  const response = await api.get("/conversations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getConversation = async (id: string) => {
  const response = await api.get(`/conversations/${id}`);
  return response.data;
};

export const createConversation = async () => {
  const response = await api.post("/conversations", {
    title: "New Chat",
  });

  return response.data;
};

export const deleteConversation = async (id: string) => {
  const response = await api.delete(`/conversations/${id}`);
  return response.data;
};
