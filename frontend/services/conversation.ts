import api from "./api";

export const getConversations = async (token: string) => {
  const response = await api.get("/conversations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createConversation = async (token: string) => {
  const response = await api.post(
    "/conversations",
    {
      title: "New Chat",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
