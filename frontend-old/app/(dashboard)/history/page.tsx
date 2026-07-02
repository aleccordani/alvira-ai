"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  id: number;
  question: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("alvira-history") || "[]");

    setHistory(stored);
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0F19] p-10 text-white">
      <h1 className="text-4xl font-bold">History</h1>

      <p className="mt-2 text-slate-400">Your previous AI conversations</p>

      <div className="mt-8 space-y-4">
        {history.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
            No history yet.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
            >
              <p className="font-medium">{item.question}</p>

              <p className="mt-2 text-sm text-slate-400">{item.createdAt}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
