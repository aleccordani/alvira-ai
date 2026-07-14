export type BillingPermissions = {
  canChat: boolean;
  canGenerateImage: boolean;
  canWorkspace: boolean;
  canMemory: boolean;
  canAnalytics: boolean;
  canVision: boolean;
  monthlyCredits: number;
};

export type BillingPlan = {
  id: string | null;
  name: string;
  type: "FREE" | "PRO" | "BUSINESS";
};

export type BillingOverview = {
  plan: BillingPlan;
  monthlyCredits: number;
  creditsUsed: number;
  creditsRemaining: number;
  subscriptionStatus: string;
  startedAt: string | null;
  expiresAt: string | null;
  permissions: BillingPermissions;
};
