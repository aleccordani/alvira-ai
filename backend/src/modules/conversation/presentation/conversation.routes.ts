import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";

import { CreateConversationUseCase } from "../application/create-conversation.usecase.js";
import { GetConversationUseCase } from "../application/get-conversation.usecase.js";
import { GetConversationsUseCase } from "../application/get-conversations.usecase.js";
import { UpdateConversationUseCase } from "../application/update-conversation.usecase.js";
import { DeleteConversationUseCase } from "../application/delete-conversation.usecase.js";

import { PrismaConversationRepository } from "../infrastructure/prisma-conversation.repository.js";
import { ConversationController } from "./conversation.controller.js";

import { conversationController } from "../../../container/conversation.container.js";

const router = Router();

const repository = new PrismaConversationRepository();

const createConversationUseCase = new CreateConversationUseCase(repository);
const getConversationUseCase = new GetConversationUseCase(repository);
const getConversationsUseCase = new GetConversationsUseCase(repository);
const updateConversationUseCase = new UpdateConversationUseCase(repository);
const deleteConversationUseCase = new DeleteConversationUseCase(repository);

const controller = new ConversationController(
  createConversationUseCase,
  getConversationUseCase,
  getConversationsUseCase,
  updateConversationUseCase,
  deleteConversationUseCase,
);

router.post("/", authMiddleware, conversationController.create);

router.get("/", authMiddleware, conversationController.findAll);

router.get("/:id", authMiddleware, conversationController.findOne);

router.patch("/:id", authMiddleware, conversationController.update);

router.delete("/:id", authMiddleware, conversationController.delete);

export default router;
