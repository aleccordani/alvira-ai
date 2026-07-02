const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export const chatService = {
  async getConversations() {
    const response = await fetch(`${API_BASE_URL}/api/conversations`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    return response.json();
  },
};
