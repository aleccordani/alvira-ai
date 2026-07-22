import { api } from "../../../lib/api";

export type AdminDashboardStats = {
  users: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalRequests: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";

  tokensUsed: number;
  monthlyCredits: number;
  creditsUsed: number;
  creditsRemaining: number;

  storageUsed: number;
  imageUsed: number;
  workspaceUsed: number;

  createdAt: string;
  updatedAt: string;

  plan: {
    id: string;
    name: string;
    type: string;
    monthlyCredits: number;
  } | null;

  _count: {
    conversations: number;
    workspaces: number;
    documents: number;
    generatedImages: number;
    usageLogs: number;
    payments: number;
  };
};

export type AdminUserAction =
  | "SET_PLAN"
  | "RESET_CREDITS"
  | "SUSPEND"
  | "ACTIVATE";

export type AdminPlanType = "FREE" | "PRO" | "BUSINESS";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ManageUserPayload = {
  action: AdminUserAction;
  planType?: AdminPlanType;
};

export const adminService = {
  async checkAccess(): Promise<boolean> {
    try {
      const response =
        await api.get<ApiResponse<AdminDashboardStats>>("/admin/dashboard");

      return response.status === 200 && response.data.success;
    } catch {
      return false;
    }
  },

  async getDashboard(): Promise<AdminDashboardStats> {
    const response =
      await api.get<ApiResponse<AdminDashboardStats>>("/admin/dashboard");

    return response.data.data;
  },

  async getUsers(): Promise<AdminUser[]> {
    const response = await api.get<ApiResponse<AdminUser[]>>("/admin/users");

    return response.data.data;
  },

  async manageUser(userId: string, payload: ManageUserPayload) {
    const response = await api.patch(`/admin/users/${userId}`, payload);

    return response.data;
  },
};
