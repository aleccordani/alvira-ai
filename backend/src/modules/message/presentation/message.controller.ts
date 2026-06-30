import { Request, Response } from "express";
import { createMessageSchema } from "./message.validation.js";
import { CreateMessageUseCase } from "../application/create-message.usecase.js";
import { GetMessagesUseCase } from "../application/get-messages.usecase.js";
import { successResponse } from "../../../shared/utils/response.js";

export class MessageController {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
  ) {}

  create = async (req: Request, res: Response) => {
    const body = createMessageSchema.parse(req.body);

    const message = await this.createMessageUseCase.execute({
      conversationId: body.conversationId,
      content: body.content,
    });

    return successResponse(res, "Message created", message, 201);
  };

  findByConversation = async (req: Request, res: Response) => {
    const conversationId = String(req.params.conversationId);

    const messages = await this.getMessagesUseCase.execute(conversationId);

    return successResponse(res, "Messages fetched", messages);
  };
}
