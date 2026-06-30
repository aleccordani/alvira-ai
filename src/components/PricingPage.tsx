import React, { useState } from "react";
import { Check, X, ArrowLeft, ShieldAlert, Sparkles, HelpCircle, ChevronDown } from "lucide-react";

interface PricingPageProps {
  onBack: () => void;
  onSelectPlan: (plan: "Free" | "Pro" | "Business") => void;
}

export default function PricingPage({ onBack, onSelectPlan }: PricingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const featuresList = [
    { name: "Monthly Token Quota", free: "100,000", pro: "1,500,000", biz: "5,000,000" },
    { name: "Core Models Access (Alvira-1)", free: true, pro: true, biz: true },
    { name: "Advanced Reasoning (Alvira-Pro)", free: false, pro: true, biz: true },
    { name: "Advanced Neural Code Studio", free: false, pro: true, biz: true },
    { name: "LingoFlow Multi-Language Translator", free: false, pro: true, biz: true },
    { name: "Maximum Prompt Token Window", free: "8k tokens", pro: "32k tokens", biz: "128k tokens" },
    { name: "Concurrent Sessions Allowed", free: "1 active session", pro: "5 active sessions", biz: "Unlimited" },
    { name: "Enterprise Auth & SAML SSO", free: false, pro: false, biz: true },
    { name: "Dedicated Server Priority Thread", free: false, pro: false, biz: true },
    { name: "Shared Team Workspace Integration", free: false, pro: false, biz: true },
    { name: "Personalized Fine-Tuned System Rules", free: false, pro: "Custom System Prompt", biz: "Custom Tuned Models" },
    { name: "Email & Chat Support Ticketing", free: "Standard Support", pro: "24h Priority Support", biz: "24/7 Dedicated Account Manager" },
  ];

  const pricingFaqs = [
    {
      q: "What are Alvira AI Tokens?",
      a: "Tokens correspond to the semantic chunks of raw text or program files being evaluated or synthesized. As a rough guide, 1 token is about 4 characters of standard English text. Pro Studio allocates 1.5M tokens, which is perfect for continuous, high-intensity daily drafting and refactoring workflows.",
    },
    {
      q: "Can I upgrade or downgrade my tier at any time?",
      a: "Yes. You can instantly toggle between tiers on your Settings panel. If upgrading, your token quotas regenerate instantly with pro-rated pricing credits.",
    },
    {
      q: "What happens if I exhaust my token balance?",
      a: "Don't worry! If you run low on tokens, you will simply fall back to our lightweight standard thread. You can also buy single top-up tokens inside your dashboard workspace.",
    },
    {
      q: "Are my files kept private?",
      a: "Completely. Security is a non-negotiable core value of Alvira AI. All files, summaries, and chat streams are executed inside isolated container instances on secure server nodes and are never shared or logged.",
    },
  ];

  return (
    <div className="bg-[#0b0c10] text-[#c5c6c7] font-sans min-h-screen pt-24 pb-16 px-6 relative selection:bg-purple-600 selection:text-white">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-purple-950/25 to-transparent filter blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-[#8b8e99] hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to landing page
          </button>

          <div className="flex items-center gap-2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuUZdduHPeVBhH172qlFSuPIREmM67D_QdrLNLd-GOUrG457VWZpbdoWsj62hHKDWs-QZMJH4Ogw7YHeVF9OY8EdZEX7BS1U4sO8J7HjQyzHSzfzVQwABiyi5C0Mz45u58BZFMtykONIPpWhrzNcSP7CXvU6j49a3mIsV5vrp_zzs__5SQn2WoLbObDDUQVG4MpYUW_xoXrnq--DpV80izJkiXPZZsMWOkuYJxzfvRO_wYiZapNGia5l3mrndlKv3KXYHnCmqKbUrZ"
              alt="Alvira Logo"
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-bold text-white tracking-wider">ALVIRA PRO</span>
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-950/40 border border-purple-500/20 rounded-full text-xs font-semibold text-purple-400 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Transparent Pricing
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Plans Engineered for Every Stage
          </h1>
          <p className="mt-4 text-[#8b8e99] max-w-xl mx-auto font-light text-sm md:text-base">
            Whether you are a solo researcher, specialized software engineer, or scaling enterprise, we have a tier structured for your volume.
          </p>
        </div>

        {/* Pricing Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {/* Free Plan */}
          <div className="bg-[#16171f]/60 p-8 rounded-2xl border border-purple-950/15 flex flex-col justify-between hover:border-purple-800/10 transition">
            <div>
              <h3 className="text-xl font-bold text-white">Starter</h3>
              <p className="text-xs text-[#8b8e99] mt-1.5">Evaluate Alvira&apos;s interface and speed</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-xs text-[#8b8e99] ml-1.5">/ month</span>
              </div>
              <p className="text-xs text-[#8b8e99] mt-4 leading-relaxed">
                Includes basic standard token quotas suitable for simple queries, testing, and system familiarization.
              </p>
            </div>
            <button
              onClick={() => onSelectPlan("Free")}
              className="mt-8 w-full py-3.5 bg-[#1f2029] text-white font-semibold rounded-xl hover:bg-[#252733] transition text-sm shadow-md"
            >
              Start Free Trial
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#16171f] p-8 rounded-2xl border-2 border-purple-600 relative flex flex-col justify-between shadow-xl shadow-purple-900/10">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white rounded-full text-[10px] font-bold tracking-wider uppercase">
              Most Popular
            </span>
            <div>
              <h3 className="text-xl font-bold text-white">Pro Studio</h3>
              <p className="text-xs text-purple-400 mt-1.5">Unleash advanced neural reasoning</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-white">$29</span>
                <span className="text-xs text-[#8b8e99] ml-1.5">/ month</span>
              </div>
              <p className="text-xs text-[#c5c6c7] mt-4 leading-relaxed">
                Unlock our high-end Alvira-Pro reasoning model, 1.5 Million monthly tokens, neural coding studio, and advanced translator.
              </p>
            </div>
            <button
              onClick={() => onSelectPlan("Pro")}
              className="mt-8 w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition text-sm shadow-lg shadow-purple-950/20"
            >
              Get Started with Pro
            </button>
          </div>

          {/* Business Plan */}
          <div className="bg-[#16171f]/60 p-8 rounded-2xl border border-purple-950/15 flex flex-col justify-between hover:border-purple-800/10 transition">
            <div>
              <h3 className="text-xl font-bold text-white">Team Enterprise</h3>
              <p className="text-xs text-[#8b8e99] mt-1.5">Scale intelligence across departments</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-white">$99</span>
                <span className="text-xs text-[#8b8e99] ml-1.5">/ month</span>
              </div>
              <p className="text-xs text-[#8b8e99] mt-4 leading-relaxed">
                Equip your organization with a massive 5 Million shared monthly token pool, organization templates, and priority backend routing.
              </p>
            </div>
            <button
              onClick={() => onSelectPlan("Business")}
              className="mt-8 w-full py-3.5 bg-[#1f2029] text-white font-semibold rounded-xl hover:bg-[#252733] transition text-sm shadow-md"
            >
              Activate Enterprise
            </button>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white tracking-tight">Detailed Feature Matrix</h2>
            <p className="text-xs text-[#8b8e99] mt-2">Compare specific tools, concurrency limits, and security frameworks</p>
          </div>

          <div className="w-full overflow-x-auto rounded-xl border border-purple-950/20 bg-[#16171f]/30">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-purple-950/20 bg-[#101118]">
                  <th className="p-5 text-xs font-semibold text-white tracking-wider">FEATURE SPECIFICATION</th>
                  <th className="p-5 text-xs font-semibold text-white tracking-wider">STARTER (FREE)</th>
                  <th className="p-5 text-xs font-semibold text-purple-400 tracking-wider">PRO STUDIO ($29)</th>
                  <th className="p-5 text-xs font-semibold text-white tracking-wider">TEAM ENTERPRISE ($99)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950/10 text-xs">
                {featuresList.map((feature, idx) => (
                  <tr key={idx} className="hover:bg-purple-950/5 transition-colors">
                    <td className="p-5 font-medium text-white">{feature.name}</td>
                    <td className="p-5 text-[#8b8e99]">
                      {typeof feature.free === "boolean" ? (
                        feature.free ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-500/50" />
                        )
                      ) : (
                        feature.free
                      )}
                    </td>
                    <td className="p-5 text-purple-300 font-medium">
                      {typeof feature.pro === "boolean" ? (
                        feature.pro ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-500/50" />
                        )
                      ) : (
                        feature.pro
                      )}
                    </td>
                    <td className="p-5 text-[#c5c6c7]">
                      {typeof feature.biz === "boolean" ? (
                        feature.biz ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-500/50" />
                        )
                      ) : (
                        feature.biz
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Accordian */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" /> Pricing FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {pricingFaqs.map((faq, idx) => (
              <div key={idx} className="bg-[#16171f] rounded-xl border border-purple-950/25 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center text-white font-medium hover:bg-purple-950/5 transition-colors"
                >
                  <span className="text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${activeFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-[#8b8e99] border-t border-purple-950/15 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
