import { Router } from "express";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";

import { PrismaConversationRepository } from "../../conversation/infrastructure/prisma-conversation.repository.js";
import { PrismaMessageRepository } from "../../message/infrastructure/prisma-message.repository.js";
import { PrismaUsageRepository } from "../../usage/infrastructure/prisma-usage.repository.js";

import { SendChatUseCase } from "../application/send-chat.usecase.js";
import { StreamChatUseCase } from "../application/stream-chat.usecase.js";
import { CreateUsageLogUseCase } from "../../usage/application/create-usage-log.usecase.js";

import { OpenAIService } from "../infrastructure/openai.service.js";
import { ChatController } from "./chat.controller.js";

const router = Router();

const messageRepository = new PrismaMessageRepository();
const conversationRepository = new PrismaConversationRepository();
const usageRepository = new PrismaUsageRepository();

const openAIService = new OpenAIService();
const createUsageLogUseCase = new CreateUsageLogUseCase(usageRepository);

const sendChatUseCase = new SendChatUseCase(
  messageRepository,
  conversationRepository,
  openAIService,
  createUsageLogUseCase,
);

const streamChatUseCase = new StreamChatUseCase(
  messageRepository,
  conversationRepository,
  openAIService,
  createUsageLogUseCase,
);

const controller = new ChatController(sendChatUseCase, streamChatUseCase);

router.post("/", authMiddleware, controller.send);
router.post("/stream", authMiddleware, controller.stream);

export default router;
