import { Request, Response } from "express";
import { chatSchema } from "./chat.validation.js";
import { SendChatUseCase } from "../application/send-chat.usecase.js";
import { successResponse } from "../../../shared/utils/response.js";

export class ChatController {
  constructor(private readonly sendChatUseCase: SendChatUseCase) {}

  send = async (req: Request, res: Response) => {
    const body = chatSchema.parse(req.body);

    const result = await this.sendChatUseCase.execute({
      conversationId: body.conversationId,
      content: body.content,
    });

    return successResponse(res, "Chat response generated", result);
  };
}
