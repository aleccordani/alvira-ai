import type { Request, Response } from "express";
import { ZodError } from "zod";

import { SendChatUseCase } from "../application/send-chat.usecase.js";
import { StreamChatUseCase } from "../application/stream-chat.usecase.js";
import { successResponse } from "../../../shared/utils/response.js";
import { chatSchema } from "./chat.validation.js";

const isInsufficientCreditsError = (error: unknown) =>
  error instanceof Error && error.message === "INSUFFICIENT_CREDITS";

const isConversationNotFoundError = (error: unknown) =>
  error instanceof Error && error.message === "Conversation not found";

export class ChatController {
  constructor(
    private readonly sendChatUseCase: SendChatUseCase,
    private readonly streamChatUseCase: StreamChatUseCase,
  ) {}

  send = async (req: Request, res: Response) => {
    try {
      const body = chatSchema.parse(req.body);

      const result = await this.sendChatUseCase.execute({
        conversationId: body.conversationId,
        content: body.content,
        tool: body.tool,
      });

      return successResponse(res, "Chat response generated", result);
    } catch (error) {
      if (isInsufficientCreditsError(error)) {
        return res.status(402).json({
          success: false,
          code: "INSUFFICIENT_CREDITS",
          message: "Credits exhausted. Please upgrade your plan.",
        });
      }

      if (isConversationNotFoundError(error)) {
        return res.status(404).json({
          success: false,
          code: "CONVERSATION_NOT_FOUND",
          message: "Conversation not found.",
        });
      }

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          code: "VALIDATION_ERROR",
          message: "Invalid chat request.",
          errors: error.flatten(),
        });
      }

      console.error("SEND CHAT ERROR:", error);

      return res.status(500).json({
        success: false,
        code: "CHAT_FAILED",
        message: "Failed to generate chat response.",
      });
    }
  };

  stream = async (req: Request, res: Response) => {
    let streamStarted = false;

    const startStream = () => {
      if (streamStarted) return;

      res.status(200);
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      streamStarted = true;
    };

    try {
      const body = chatSchema.parse(req.body);

      await this.streamChatUseCase.execute({
        conversationId: body.conversationId,
        content: body.content,
        tool: body.tool,

        onChunk: (chunk: string) => {
          startStream();

          res.write(
            `data: ${JSON.stringify({
              chunk,
            })}\n\n`,
          );
        },
      });

      startStream();

      res.write(
        `data: ${JSON.stringify({
          done: true,
        })}\n\n`,
      );

      return res.end();
    } catch (error) {
      if (!streamStarted) {
        if (isInsufficientCreditsError(error)) {
          return res.status(402).json({
            success: false,
            code: "INSUFFICIENT_CREDITS",
            message: "Credits exhausted. Please upgrade your plan.",
          });
        }

        if (isConversationNotFoundError(error)) {
          return res.status(404).json({
            success: false,
            code: "CONVERSATION_NOT_FOUND",
            message: "Conversation not found.",
          });
        }

        if (error instanceof ZodError) {
          return res.status(400).json({
            success: false,
            code: "VALIDATION_ERROR",
            message: "Invalid chat request.",
            errors: error.flatten(),
          });
        }

        console.error("STREAM CHAT ERROR:", error);

        return res.status(500).json({
          success: false,
          code: "CHAT_STREAM_FAILED",
          message: "Failed to stream chat response.",
        });
      }

      console.error("STREAM CHAT ERROR AFTER START:", error);

      res.write(
        `data: ${JSON.stringify({
          error: true,
          status: 500,
          code: "CHAT_STREAM_FAILED",
          message: "Chat stream was interrupted.",
        })}\n\n`,
      );

      return res.end();
    }
  };
}
