"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

const menuItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "AI Chat", href: "/chat" },
  { name: "Generator", href: "/generator" },
  { name: "History", href: "/history" },
  { name: "Settings", href: "/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen bg-[#0B0F19] text-white">
      <aside className="flex w-64 flex-col border-r border-slate-800 p-6">
        <img
          src="/alvira-logo.png"
          alt="ALVIRA"
          className="mb-10 h-28 w-auto"
        />

        <nav className="flex flex-1 flex-col gap-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-500/15 text-blue-400 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-slate-800 pt-6">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-3 text-left text-red-400 transition hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      </aside>

      <AuthGuard>
        <section className="flex-1">{children}</section>
      </AuthGuard>
    </main>
  );
}
