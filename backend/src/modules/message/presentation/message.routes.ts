import { Router } from "express";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";

import { PrismaMessageRepository } from "../infrastructure/prisma-message.repository.js";

import { CreateMessageUseCase } from "../application/create-message.usecase.js";
import { GetMessagesUseCase } from "../application/get-messages.usecase.js";

import { MessageController } from "./message.controller.js";

const router = Router();

const repository = new PrismaMessageRepository();

const createMessageUseCase = new CreateMessageUseCase(repository);

const getMessagesUseCase = new GetMessagesUseCase(repository);

const controller = new MessageController(
  createMessageUseCase,
  getMessagesUseCase,
);

router.post("/", authMiddleware, controller.create);

router.get("/:conversationId", authMiddleware, controller.findByConversation);

export default router;
