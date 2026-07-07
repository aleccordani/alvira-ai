export interface RecentUsage {
  id: string;
  model: string;
  totalTokens: number;
  cost: number;
  createdAt: string;
}

export interface AnalyticsStats {
  totalTokens: number;
  totalRequests: number;
  totalCost: number;
  recentUsage: RecentUsage[];
}