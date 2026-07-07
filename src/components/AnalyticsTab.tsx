import { useQuery } from "@tanstack/react-query";

import { analyticsService } from "../modules/analytics";
import AnalyticsSummary from "../modules/analytics/components/AnalyticsSummary";
import AnalyticsRecentUsage from "../modules/analytics/components/AnalyticsRecentUsage";
import AnalyticsLoading from "../modules/analytics/components/AnalyticsLoading";

export default function AnalyticsTab() {
  const { data, isPending } = useQuery({
    queryKey: ["analytics"],
    queryFn: analyticsService.getStats,
  });

  if (isPending) {
    return <AnalyticsLoading />;
  }

  return (
    <div
      className="flex-1 overflow-y-auto bg-[#0b0c10] text-[#c5c6c7] p-8 font-sans"
      id="analytics-tab"
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Analytics
        </h1>

        <p className="mt-2 text-sm text-[#8b8e99]">
          Real-time AI usage statistics from your Alvira workspace.
        </p>
      </div>

      {!data ? (
        <div className="rounded-2xl border border-purple-950/20 bg-[#16171f] p-6 text-sm text-[#8b8e99]">
          Failed to load analytics data.
        </div>
      ) : (
        <div className="space-y-6">
          <AnalyticsSummary stats={data} />

          <AnalyticsRecentUsage usage={data.recentUsage} />
        </div>
      )}
    </div>
  );
}
