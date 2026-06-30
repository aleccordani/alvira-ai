import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0F19] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
        <img
          src="/alvira-logo.png"
          alt="ALVIRA Logo"
          className="h-20 w-auto object-contain"
        />

        <div className="hidden items-center gap-10 text-sm text-slate-300 md:flex">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">About</a>
        </div>

        <Link
          href="/login"
          className="rounded-xl bg-blue-500 px-7 py-3 text-sm font-semibold text-white"
        >
          Get Started
        </Link>
      </nav>

      <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 pt-28 md:grid-cols-[1.05fr_0.95fr]">
        <div className="absolute left-[46%] top-32 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative z-10">
          <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-[64px]">
            AI Assistant for Modern Businesses
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
            Generate content, automate workflow, and grow faster with AI.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-blue-500 px-7 py-3 text-sm font-semibold text-white"
            >
              Get Started
            </Link>

            <button className="rounded-xl border border-slate-600 px-7 py-3 text-sm font-semibold text-slate-300">
              Learn More
            </button>
          </div>
        </div>

        <div className="relative z-10 max-w-md rounded-3xl border border-slate-800 bg-[#111827]/80 p-8 shadow-2xl">
          <h2 className="text-xl font-bold">AI Analytics</h2>

          <div className="mt-6 space-y-6">
            <div>
              <p className="text-2xl font-bold">12.4K</p>
              <p className="text-sm text-slate-400">Content Generated</p>
            </div>

            <div>
              <p className="text-2xl font-bold">89%</p>
              <p className="text-sm text-slate-400">Productivity Boost</p>
            </div>

            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-slate-400">Active Projects</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
