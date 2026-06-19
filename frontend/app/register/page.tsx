"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <img
          src="/alvira-logo.png"
          alt="ALVIRA"
          className="mx-auto mb-6 h-20"
        />

        <h1 className="text-center text-3xl font-bold">Create Account</h1>
        <p className="mt-2 text-center text-slate-400">Join ALVIRA today</p>

        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border border-slate-700 bg-[#0B0F19] px-4 py-3 outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-700 bg-[#0B0F19] px-4 py-3 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-700 bg-[#0B0F19] px-4 py-3 outline-none"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 py-3 font-semibold"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
