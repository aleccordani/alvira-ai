import type { AnalyticsStats } from "../types";

type Props = {
  stats: AnalyticsStats;
};

export default function AnalyticsSummary({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-2xl border border-purple-950/20 bg-[#16171f] p-5">
        <p className="text-xs text-[#8b8e99]">Total Tokens</p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          {stats.totalTokens.toLocaleString()}
        </h2>
      </div>

      <div className="rounded-2xl border border-purple-950/20 bg-[#16171f] p-5">
        <p className="text-xs text-[#8b8e99]">Requests</p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          {stats.totalRequests}
        </h2>
      </div>

      <div className="rounded-2xl border border-purple-950/20 bg-[#16171f] p-5">
        <p className="text-xs text-[#8b8e99]">Estimated Cost</p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          ${stats.totalCost.toFixed(4)}
        </h2>
      </div>
    </div>
  );
}
