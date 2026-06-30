import { z } from "zod";

export const chatSchema = z.object({
  conversationId: z.string().min(1, "Conversation id is required"),
  content: z.string().min(1, "Message content is required"),
});
