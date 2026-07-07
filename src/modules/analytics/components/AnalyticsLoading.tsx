export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-28 rounded-2xl bg-[#16171f]" />
        ))}
      </div>

      <div className="h-80 rounded-2xl bg-[#16171f]" />
    </div>
  );
}
