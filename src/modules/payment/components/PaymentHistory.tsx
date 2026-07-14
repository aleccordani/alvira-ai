import { useQuery } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";

import { paymentService } from "../../billing/services/payment.service";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

export default function PaymentHistory() {
  const { data = [], isPending } = useQuery({
    queryKey: ["payment-history"],
    queryFn: paymentService.getPaymentHistory,
  });

  return (
    <section className="rounded-2xl border border-purple-900/30 bg-[#15161D] p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Payment History</h2>

        <p className="mt-1 text-sm text-gray-400">
          Your previous subscriptions and invoices.
        </p>
      </div>

      {isPending ? (
        <div className="rounded-xl border border-purple-900/20 p-8 text-center text-sm text-gray-400">
          Loading payment history...
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-purple-900/20 p-10 text-center">
          <ReceiptText className="h-9 w-9 text-violet-400" />

          <h3 className="mt-4 font-semibold text-white">No payments yet</h3>

          <p className="mt-1 text-sm text-gray-400">
            Your transactions and invoices will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-purple-900/20">
          <table className="w-full min-w-[680px]">
            <thead className="bg-[#1d1e28]">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400">
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Provider</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((payment) => {
                const normalizedStatus = payment.status.toUpperCase();

                const statusClass =
                  normalizedStatus === "SUCCESS" || normalizedStatus === "PAID"
                    ? "bg-green-500/15 text-green-400"
                    : normalizedStatus === "PENDING"
                      ? "bg-yellow-500/15 text-yellow-400"
                      : "bg-red-500/15 text-red-400";

                return (
                  <tr
                    key={payment.id}
                    className="border-t border-purple-900/20 text-sm"
                  >
                    <td className="px-5 py-4 text-gray-300">
                      {formatDate(payment.createdAt)}
                    </td>

                    <td className="px-5 py-4 font-medium text-white">
                      {payment.plan?.name ?? "Unknown Plan"}
                    </td>

                    <td className="px-5 py-4 text-gray-300">
                      {formatCurrency(payment.amount)}
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {payment.provider}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                      >
                        {normalizedStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
