export default function DashboardPage() {
  return (
    <section className="px-10 py-8">
      <h1 className="mb-2 text-3xl font-bold">Welcome back 👋</h1>
      <p className="mb-8 text-slate-400">
        Here's your AI productivity overview.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <p className="text-sm text-slate-400">Total Generations</p>
          <h2 className="mt-3 text-3xl font-bold">12.4K</h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <p className="text-sm text-slate-400">AI Performance</p>
          <h2 className="mt-3 text-3xl font-bold">89%</h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
          <p className="text-sm text-slate-400">Active Projects</p>
          <h2 className="mt-3 text-3xl font-bold">24</h2>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-6">
        <h2 className="text-2xl font-bold">AI Assistant</h2>
        <p className="mt-2 text-slate-400">Ask anything to Alvira AI.</p>

        <div className="mt-6 flex flex-col gap-5">
          <div className="ml-auto max-w-xs rounded-2xl bg-blue-500 px-5 py-4 text-sm font-semibold">
            How can I improve productivity?
          </div>

          <div className="max-w-sm rounded-2xl bg-[#0B0F19] px-5 py-4 text-sm text-slate-200">
            Try time blocking and prioritizing your most important tasks first.
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <input
            type="text"
            placeholder="Ask Alvira anything..."
            className="flex-1 rounded-xl border border-slate-700 bg-[#0B0F19] px-4 py-3 outline-none"
          />

          <button className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold">
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
