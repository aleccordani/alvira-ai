import { Request, Response } from "express";
import { GetAnalyticsStatsUseCase } from "../application/get-analytics-stats.usecase.js";

const usecase = new GetAnalyticsStatsUseCase();

export class AnalyticsController {
  async stats(req: Request, res: Response) {
    const userId = (req as any).user.userId;

    const result = await usecase.execute(userId);

    res.json(result);
  }
}
