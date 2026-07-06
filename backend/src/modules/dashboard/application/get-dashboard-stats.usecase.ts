export interface DashboardStats {
  conversations: number;
  workspaces: number;
  documents: number;
  aiRequests: number;
}

export class GetDashboardStatsUseCase {
  async execute(): Promise<DashboardStats> {
    return {
      conversations: 12,
      workspaces: 8,
      documents: 31,
      aiRequests: 154,
    };
  }
}
