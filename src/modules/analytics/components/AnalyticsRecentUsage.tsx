import type { RecentUsage } from "../types";

type Props = {
  usage: RecentUsage[];
};

export default function AnalyticsRecentUsage({ usage }: Props) {
  if (usage.length === 0) {
    return (
      <div className="rounded-2xl border border-purple-950/20 bg-[#16171f] p-6 text-sm text-[#8b8e99]">
        No analytics available yet. Start using Alvira to generate usage data.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-950/20 bg-[#16171f] p-6">
      <h2 className="mb-4 text-sm font-bold text-white">Recent Usage</h2>

      <div className="space-y-3">
        {usage.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-purple-950/20 bg-[#101117] p-4"
          >
            <div>
              <p className="text-sm font-semibold text-white">{item.model}</p>
              <p className="text-xs text-[#8b8e99]">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-white">
                {item.totalTokens.toLocaleString()} tokens
              </p>
              <p className="text-xs text-[#8b8e99]">${item.cost.toFixed(4)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
