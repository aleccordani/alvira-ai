import { Request, Response } from "express";
import { chatSchema } from "./chat.validation.js";
import { SendChatUseCase } from "../application/send-chat.usecase.js";
import { StreamChatUseCase } from "../application/stream-chat.usecase.js";
import { successResponse } from "../../../shared/utils/response.js";

export class ChatController {
  constructor(
    private readonly sendChatUseCase: SendChatUseCase,
    private readonly streamChatUseCase: StreamChatUseCase,
  ) {}

  send = async (req: Request, res: Response) => {
    const body = chatSchema.parse(req.body);

    const result = await this.sendChatUseCase.execute({
      conversationId: body.conversationId,
      content: body.content,
    });

    return successResponse(res, "Chat response generated", result);
  };

  stream = async (req: Request, res: Response) => {
    const body = chatSchema.parse(req.body);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    await this.streamChatUseCase.execute({
      conversationId: body.conversationId,
      content: body.content,
      onChunk: (chunk: string) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      },
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  };
}
