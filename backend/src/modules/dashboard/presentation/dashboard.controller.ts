import { Request, Response } from "express";
import { GetDashboardStatsUseCase } from "../application/get-dashboard-stats.usecase.js";

const usecase = new GetDashboardStatsUseCase();

export class DashboardController {
  async stats(req: Request, res: Response) {
    const userId = (req as any).user.userId;

    const result = await usecase.execute(userId);

    res.json(result);
  }
}
