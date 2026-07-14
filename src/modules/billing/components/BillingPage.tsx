import { useQuery } from "@tanstack/react-query";
import { Check, CreditCard, Crown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { billingService } from "../services/billing.service";
import { paymentService } from "../services/payment.service";
import PaymentHistory from "../../payment/components/PaymentHistory";

export default function BillingPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["billing"],
    queryFn: billingService.getMyBilling,
  });

  const handleUpgrade = async () => {
    try {
      setIsCheckingOut(true);

      const checkout = await paymentService.createCheckout();

      if (checkout.redirectUrl) {
        window.location.href = checkout.redirectUrl;
        return;
      }

      toast.success("Checkout created successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to start checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isPending) {
    return <div className="p-8 text-white">Loading billing...</div>;
  }

  if (!data) {
    return <div className="p-8 text-red-400">Failed to load billing.</div>;
  }

  const usagePercentage =
    data.monthlyCredits > 0
      ? Math.min((data.creditsUsed / data.monthlyCredits) * 100, 100)
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <CreditCard className="h-7 w-7 text-violet-400" />
          Billing
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Manage your plan, monthly credits, and subscription.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-purple-900/20 bg-[#16171f] p-5">
          <p className="text-xs text-gray-400">Current Plan</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {data.plan.name}
          </h2>
        </div>

        <div className="rounded-2xl border border-purple-900/20 bg-[#16171f] p-5">
          <p className="text-xs text-gray-400">Monthly Credits</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {data.monthlyCredits.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl border border-purple-900/20 bg-[#16171f] p-5">
          <p className="text-xs text-gray-400">Remaining</p>
          <h2 className="mt-2 text-2xl font-bold text-green-400">
            {data.creditsRemaining.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl border border-purple-900/20 bg-[#16171f] p-5">
          <p className="text-xs text-gray-400">Status</p>
          <h2 className="mt-2 text-2xl font-bold text-violet-400">
            {data.subscriptionStatus}
          </h2>
        </div>
      </div>

      <section className="rounded-2xl border border-purple-900/30 bg-[#15161D] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-yellow-400" />
              <span className="text-lg font-semibold text-white">
                Current Subscription
              </span>
            </div>

            <div className="mt-5 text-4xl font-bold text-violet-400">
              {data.plan.name}
            </div>

            <div className="mt-2 text-sm text-gray-400">
              Status: {data.subscriptionStatus}
            </div>

            <div className="mt-1 text-sm text-gray-500">
              {data.expiresAt
                ? `Expires ${new Date(data.expiresAt).toLocaleDateString(
                    "id-ID",
                  )}`
                : "No expiration date"}
            </div>
          </div>

          <div className="w-full lg:max-w-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-white">Credit usage</span>
              <span className="text-gray-400">
                {data.creditsUsed.toLocaleString()} /{" "}
                {data.monthlyCredits.toLocaleString()}
              </span>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#23242d]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 transition-all"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>{usagePercentage.toFixed(1)}% used</span>
              <span>
                {data.creditsRemaining.toLocaleString()} credits remaining
              </span>
            </div>

            {data.plan.type !== "PRO" && (
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={isCheckingOut}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCheckingOut ? "Preparing Checkout..." : "Upgrade to Pro"}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">Available Plans</h2>
          <p className="mt-1 text-sm text-gray-400">
            Choose the plan that fits your workflow.
          </p>
        </div>
        
        <PaymentHistory />

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-purple-900/25 bg-[#15161D] p-6">
            <div>
              <p className="text-sm font-semibold text-gray-300">Starter</p>

              <div className="mt-3 text-3xl font-bold text-white">
                Rp0
                <span className="ml-1 text-sm font-normal text-gray-500">
                  /month
                </span>
              </div>
            </div>

            <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                1,000 monthly credits
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                Basic AI Chat
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />1 Workspace
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                10 MB upload limit
              </li>
            </ul>

            <button
              type="button"
              disabled={data.plan.type === "FREE"}
              className="mt-6 w-full rounded-xl border border-purple-900/40 bg-[#20212a] px-4 py-3 text-sm font-semibold text-white disabled:cursor-default disabled:opacity-60"
            >
              {data.plan.type === "FREE" ? "Current Plan" : "Choose Starter"}
            </button>
          </div>

          <div className="relative flex flex-col rounded-2xl border border-violet-500 bg-gradient-to-b from-violet-950/35 to-[#15161D] p-6 shadow-lg shadow-violet-950/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Most Popular
            </div>

            <div>
              <p className="text-sm font-semibold text-violet-300">
                Pro Studio
              </p>

              <div className="mt-3 text-3xl font-bold text-white">
                Rp99.000
                <span className="ml-1 text-sm font-normal text-gray-500">
                  /month
                </span>
              </div>
            </div>

            <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-200">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-violet-400" />
                1,500,000 monthly credits
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-violet-400" />
                Advanced AI Chat
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-violet-400" />
                Image Studio
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-violet-400" />
                Workspace AI
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-violet-400" />
                Memory and Analytics
              </li>
            </ul>

            <button
              type="button"
              onClick={handleUpgrade}
              disabled={isCheckingOut || data.plan.type === "PRO"}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-default disabled:opacity-60"
            >
              {data.plan.type === "PRO"
                ? "Current Plan"
                : isCheckingOut
                  ? "Preparing Checkout..."
                  : "Upgrade to Pro"}
            </button>
          </div>

          <div className="flex flex-col rounded-2xl border border-purple-900/25 bg-[#15161D] p-6">
            <div>
              <p className="text-sm font-semibold text-gray-300">Team</p>

              <div className="mt-3 text-3xl font-bold text-white">
                Rp399.000
                <span className="ml-1 text-sm font-normal text-gray-500">
                  /month
                </span>
              </div>
            </div>

            <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                5,000,000 monthly credits
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                Shared workspace
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                Team analytics
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                Shared credits
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                Priority queue
              </li>
            </ul>

            <button
              type="button"
              className="mt-6 w-full rounded-xl border border-purple-800/40 bg-purple-950/20 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-950/40"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
