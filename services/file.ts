import { getToken } from "../lib/token";

const API_URL = "http://localhost:5000/api";

export const uploadPdfToConversation = async (
  conversationId: string,
  file: File,
) => {
  const token = getToken();

  const formData = new FormData();
  formData.append("conversationId", conversationId);
  formData.append("file", file);

  const response = await fetch(`${API_URL}/files/read`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload PDF");
  }

  return response.json();
};
