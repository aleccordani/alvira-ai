import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
import { errorResponse } from "../shared/utils/response.js";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("ERROR DETAIL:", error);

  if (error instanceof AppError) {
    return errorResponse(res, error.message, error.statusCode);
  }

  const isProduction = process.env.NODE_ENV === "production";

  return errorResponse(
    res,
    isProduction ? "Internal server error" : error.message,
    500,
  );
}
