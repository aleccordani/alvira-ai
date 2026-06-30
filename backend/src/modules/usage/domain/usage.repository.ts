export type UsageLogEntity = {
  id: string;
  userId: string;
  conversationId: string | null;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  createdAt: Date;
};

export type CreateUsageLogInput = {
  userId: string;
  conversationId?: string | null;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  cost?: number;
};

export interface UsageRepository {
  create(data: CreateUsageLogInput): Promise<UsageLogEntity>;
}
