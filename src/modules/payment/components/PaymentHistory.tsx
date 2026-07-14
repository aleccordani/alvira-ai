export default function PaymentHistory() {
  return (
    <section className="rounded-2xl border border-purple-900/30 bg-[#15161D] p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Payment History</h2>

        <p className="mt-1 text-sm text-gray-400">
          Your previous subscriptions and invoices.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-purple-900/20">
        <table className="w-full">
          <thead className="bg-[#1d1e28]">
            <tr className="text-left text-xs uppercase tracking-wider text-gray-400">
              <th className="px-5 py-4">Date</th>

              <th className="px-5 py-4">Plan</th>

              <th className="px-5 py-4">Amount</th>

              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-purple-900/20">
              <td className="px-5 py-4 text-gray-300">—</td>

              <td className="px-5 py-4 text-gray-300">—</td>

              <td className="px-5 py-4 text-gray-300">—</td>

              <td className="px-5 py-4">
                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-300">
                  No payments yet
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
