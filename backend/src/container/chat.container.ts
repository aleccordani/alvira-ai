import { PrismaConversationRepository } from "../modules/conversation/infrastructure/prisma-conversation.repository.js";
import { PrismaMessageRepository } from "../modules/message/infrastructure/prisma-message.repository.js";
import { PrismaUsageRepository } from "../modules/usage/infrastructure/prisma-usage.repository.js";
import { PrismaMemoryRepository } from "../modules/memory/infrastructure/prisma-memory.repository.js";

import { CreateUsageLogUseCase } from "../modules/usage/application/create-usage-log.usecase.js";
import { MemoryService } from "../modules/memory/application/memory.service.js";

import { SendChatUseCase } from "../modules/chat/application/send-chat.usecase.js";
import { StreamChatUseCase } from "../modules/chat/application/stream-chat.usecase.js";
import { ChatContextBuilder } from "../modules/chat/application/chat-context.builder.js";
import { ChatController } from "../modules/chat/presentation/chat.controller.js";

import { aiService } from "./ai.container.js";

const messageRepository = new PrismaMessageRepository();
const conversationRepository = new PrismaConversationRepository();
const usageRepository = new PrismaUsageRepository();
const memoryRepository = new PrismaMemoryRepository();

const createUsageLogUseCase = new CreateUsageLogUseCase(usageRepository);
const memoryService = new MemoryService(memoryRepository);
const chatContextBuilder = new ChatContextBuilder();

const sendChatUseCase = new SendChatUseCase(
  messageRepository,
  conversationRepository,
  aiService,
  createUsageLogUseCase,
  memoryService,
);

const streamChatUseCase = new StreamChatUseCase(
  messageRepository,
  conversationRepository,
  aiService,
  createUsageLogUseCase,
  memoryService,
  chatContextBuilder,
);

export const chatController = new ChatController(
  sendChatUseCase,
  streamChatUseCase,
);
