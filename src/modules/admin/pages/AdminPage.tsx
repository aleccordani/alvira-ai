import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Ban,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Crown,
  RefreshCcw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  adminService,
  type AdminPlanType,
  type AdminUser,
  type AdminUserAction,
} from "../services/admin.service";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

type ManageMutationPayload = {
  userId: string;
  action: AdminUserAction;
  planType?: AdminPlanType;
};

export default function AdminPage() {
  const queryClient = useQueryClient();

  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);

  const {
    data: stats,
    isPending: statsPending,
    isError: statsError,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminService.getDashboard,
    retry: false,
  });

  const {
    data: users = [],
    isPending: usersPending,
    isError: usersError,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminService.getUsers,
    retry: false,
  });

  const manageUserMutation = useMutation({
    mutationFn: ({ userId, action, planType }: ManageMutationPayload) =>
      adminService.manageUser(userId, {
        action,
        planType,
      }),

    onSuccess: async (_, variables) => {
      setOpenMenuUserId(null);

      const successMessage: Record<AdminUserAction, string> = {
        SET_PLAN: "User plan updated successfully.",
        RESET_CREDITS: "User credits reset successfully.",
        SUSPEND: "User suspended successfully.",
        ACTIVATE: "User activated successfully.",
      };

      toast.success(successMessage[variables.action]);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-users"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["billing"],
        }),
      ]);
    },

    onError: (error) => {
      console.error("MANAGE USER ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to update user.",
      );
    },
  });

  const runAction = (
    adminUser: AdminUser,
    action: AdminUserAction,
    planType?: AdminPlanType,
  ) => {
    if (action === "SUSPEND" && adminUser.role === "ADMIN") {
      toast.error("Admin accounts cannot be suspended from this menu.");
      return;
    }

    const actionLabel =
      action === "SET_PLAN"
        ? `change ${adminUser.name}'s plan to ${planType}`
        : action === "RESET_CREDITS"
          ? `reset ${adminUser.name}'s credits`
          : action === "SUSPEND"
            ? `suspend ${adminUser.name}`
            : `activate ${adminUser.name}`;

    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel}?`,
    );

    if (!confirmed) return;

    manageUserMutation.mutate({
      userId: adminUser.id,
      action,
      planType,
    });
  };

  if (statsPending || usersPending) {
    return (
      <div className="p-8 text-sm text-gray-400">Loading Admin Console...</div>
    );
  }

  if (statsError || usersError || !stats) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <h2 className="font-bold text-red-300">Admin Console unavailable</h2>

          <p className="mt-2 text-sm text-red-200/70">
            Your account does not have admin access or the backend is
            unavailable.
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: formatNumber(stats.users),
      icon: <Users className="h-5 w-5 text-violet-400" />,
    },
    {
      label: "Successful Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: <CreditCard className="h-5 w-5 text-green-400" />,
    },
    {
      label: "Active Subscriptions",
      value: formatNumber(stats.activeSubscriptions),
      icon: <Crown className="h-5 w-5 text-yellow-400" />,
    },
    {
      label: "AI Requests",
      value: formatNumber(stats.totalRequests),
      icon: <Activity className="h-5 w-5 text-blue-400" />,
    },
  ];

  return (
    <div className="min-h-full space-y-8 bg-[#0b0c10] p-6 text-[#c5c6c7] md:p-8">
      <header>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3">
            <ShieldCheck className="h-6 w-6 text-purple-400" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Admin Console
            </h1>

            <p className="mt-1 text-sm text-[#8b8e99]">
              Monitor users, subscriptions, revenue, and platform usage.
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-purple-900/25 bg-[#16171f] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#8b8e99]">{card.label}</p>

              {card.icon}
            </div>

            <p className="mt-4 text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-purple-900/25 bg-[#15161d] p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">User Management</h2>

            <p className="mt-1 text-sm text-[#8b8e99]">
              Accounts, plans, credits, activity, and status.
            </p>
          </div>

          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
            {users.length} users
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-purple-900/20">
          <table className="w-full min-w-[1250px]">
            <thead className="bg-[#1d1e28]">
              <tr className="text-left text-[11px] uppercase tracking-wider text-[#8b8e99]">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Credits</th>
                <th className="px-5 py-4">Requests</th>
                <th className="px-5 py-4">Content</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((adminUser) => {
                const creditPercentage =
                  adminUser.monthlyCredits > 0
                    ? Math.min(
                        (adminUser.creditsUsed / adminUser.monthlyCredits) *
                          100,
                        100,
                      )
                    : 0;

                const isUpdatingThisUser =
                  manageUserMutation.isPending &&
                  manageUserMutation.variables?.userId === adminUser.id;

                return (
                  <tr
                    key={adminUser.id}
                    className="border-t border-purple-900/20 text-sm"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">
                        {adminUser.name}
                      </p>

                      <p className="mt-1 text-xs text-[#8b8e99]">
                        {adminUser.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          adminUser.role === "ADMIN"
                            ? "bg-purple-500/15 text-purple-300"
                            : "bg-slate-500/15 text-slate-300"
                        }`}
                      >
                        {adminUser.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-white">
                        {adminUser.plan?.name ?? "Starter"}
                      </p>

                      <p className="mt-1 text-xs text-[#8b8e99]">
                        {adminUser.plan?.type ?? "FREE"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="w-48">
                        <div className="flex justify-between text-xs">
                          <span className="text-white">
                            {formatNumber(adminUser.creditsUsed)}
                          </span>

                          <span className="text-[#8b8e99]">
                            {formatNumber(adminUser.monthlyCredits)}
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#252631]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600"
                            style={{
                              width: `${creditPercentage}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1 text-[10px] text-green-400">
                          {formatNumber(adminUser.creditsRemaining)} remaining
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-white">
                      {formatNumber(adminUser._count.usageLogs)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1 text-xs text-[#8b8e99]">
                        <p>{adminUser._count.conversations} conversations</p>

                        <p>{adminUser._count.workspaces} workspaces</p>

                        <p>{adminUser._count.generatedImages} images</p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          adminUser.status === "ACTIVE"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {adminUser.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-[#8b8e99]">
                      {formatDate(adminUser.createdAt)}
                    </td>

                    <td className="relative px-5 py-4">
                      <button
                        type="button"
                        disabled={
                          isUpdatingThisUser || manageUserMutation.isPending
                        }
                        onClick={() =>
                          setOpenMenuUserId((current) =>
                            current === adminUser.id ? null : adminUser.id,
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdatingThisUser ? (
                          <RefreshCcw className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                        Manage
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>

                      {openMenuUserId === adminUser.id && (
                        <div className="absolute right-5 top-14 z-30 w-56 overflow-hidden rounded-xl border border-purple-500/20 bg-[#101117] p-2 shadow-2xl shadow-black/50">
                          <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-[#666a78]">
                            Change plan
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              runAction(adminUser, "SET_PLAN", "FREE")
                            }
                            className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#c5c6c7] hover:bg-purple-500/10 hover:text-white"
                          >
                            Starter / Free
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              runAction(adminUser, "SET_PLAN", "PRO")
                            }
                            className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#c5c6c7] hover:bg-purple-500/10 hover:text-white"
                          >
                            Pro Studio
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              runAction(adminUser, "SET_PLAN", "BUSINESS")
                            }
                            className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#c5c6c7] hover:bg-purple-500/10 hover:text-white"
                          >
                            Business
                          </button>

                          <div className="my-2 border-t border-purple-900/25" />

                          <button
                            type="button"
                            onClick={() =>
                              runAction(adminUser, "RESET_CREDITS")
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-blue-300 hover:bg-blue-500/10"
                          >
                            <RefreshCcw className="h-4 w-4" />
                            Reset credits
                          </button>

                          {adminUser.status === "ACTIVE" ? (
                            <button
                              type="button"
                              disabled={adminUser.role === "ADMIN"}
                              onClick={() => runAction(adminUser, "SUSPEND")}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Ban className="h-4 w-4" />
                              Suspend user
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => runAction(adminUser, "ACTIVATE")}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-green-300 hover:bg-green-500/10"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Activate user
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
