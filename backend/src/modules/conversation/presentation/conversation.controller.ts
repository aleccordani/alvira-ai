import { Request, Response } from "express";
import { AuthRequest } from "../../../middlewares/auth.middleware.js";
import {
  successResponse,
  errorResponse,
} from "../../../shared/utils/response.js";

import {
  createConversationSchema,
  updateConversationSchema,
} from "./conversation.validation.js";

import { CreateConversationUseCase } from "../application/create-conversation.usecase.js";
import { GetConversationUseCase } from "../application/get-conversation.usecase.js";
import { GetConversationsUseCase } from "../application/get-conversations.usecase.js";
import { UpdateConversationUseCase } from "../application/update-conversation.usecase.js";
import { DeleteConversationUseCase } from "../application/delete-conversation.usecase.js";

export class ConversationController {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
    private readonly getConversationUseCase: GetConversationUseCase,
    private readonly getConversationsUseCase: GetConversationsUseCase,
    private readonly updateConversationUseCase: UpdateConversationUseCase,
    private readonly deleteConversationUseCase: DeleteConversationUseCase,
  ) {}

  create = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const body = createConversationSchema.parse(req.body);

    const conversation = await this.createConversationUseCase.execute({
      title: body.title,
      userId,
    });

    return successResponse(res, "Conversation created", conversation, 201);
  };

  findAll = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const conversations = await this.getConversationsUseCase.execute(userId);

    return successResponse(res, "Conversations fetched", conversations);
  };

  findOne = async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!id) {
      return errorResponse(res, "Conversation id is required", 400);
    }

    const conversation = await this.getConversationUseCase.execute(id);

    return successResponse(res, "Conversation fetched", conversation);
  };

  update = async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!id) {
      return errorResponse(res, "Conversation id is required", 400);
    }

    const body = updateConversationSchema.parse(req.body);

    const conversation = await this.updateConversationUseCase.execute({
      id,
      title: body.title,
    });

    return successResponse(res, "Conversation updated", conversation);
  };

  delete = async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!id) {
      return errorResponse(res, "Conversation id is required", 400);
    }

    await this.deleteConversationUseCase.execute(id);

    return successResponse(res, "Conversation deleted");
  };
}
