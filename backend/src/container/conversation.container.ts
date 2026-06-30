import { PrismaConversationRepository } from "../modules/conversation/infrastructure/prisma-conversation.repository.js";

import { CreateConversationUseCase } from "../modules/conversation/application/create-conversation.usecase.js";
import { GetConversationUseCase } from "../modules/conversation/application/get-conversation.usecase.js";
import { GetConversationsUseCase } from "../modules/conversation/application/get-conversations.usecase.js";
import { UpdateConversationUseCase } from "../modules/conversation/application/update-conversation.usecase.js";
import { DeleteConversationUseCase } from "../modules/conversation/application/delete-conversation.usecase.js";

import { ConversationController } from "../modules/conversation/presentation/conversation.controller.js";

const repository = new PrismaConversationRepository();

export const conversationController = new ConversationController(
  new CreateConversationUseCase(repository),
  new GetConversationUseCase(repository),
  new GetConversationsUseCase(repository),
  new UpdateConversationUseCase(repository),
  new DeleteConversationUseCase(repository),
);
