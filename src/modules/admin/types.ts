export interface AdminStats {
  totalUsers: number;
  totalWorkspaces: number;
  totalWorkspaceFiles: number;
  totalImages: number;
  revenue: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AdminOverview {
  stats: AdminStats;
  latestUsers: AdminUser[];
}
