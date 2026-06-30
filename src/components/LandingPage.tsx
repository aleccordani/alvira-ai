import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  MessageSquare,
  Code2,
  Database,
  Users2,
  ChevronDown,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
  onRegister?: () => void;
  onNavigateToPricing: () => void;
}

export default function LandingPage({ onLogin, onRegister, onNavigateToPricing }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleRegisterClick = () => {
    if (onRegister) {
      onRegister();
    } else {
      onLogin();
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      id: "writing",
      icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
      title: "Masterful Writing",
      description:
        "Draft flawless marketing copy, structure documents, and refine summaries in seconds. Powered by Alvira's contextual understanding engine.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDXOO3SQt-uYVgWPeRY1tca-irPgxlHk1Y1tRWGRSP8qMm0rl2axijspgIDEBy2s1l4vOzuCwbFJtUgfO6ysOeDd5r6Z86jbGC7qfVvmy0sOYIdkIa8Tn3stZKkLEThLnszPOnJqEHPE2sDjwNnUyPpBRdw1wAWGv__TR25n6GvRgEixXOxpP5RO-ZSKtZicz2zua-G9nW5NJXyGrPKLKB03R5-tAzduEqVZirvuYDchuiILmGslsp7BoC3GoT5q4AiaONxgJA4bqZm",
    },
    {
      id: "coding",
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      title: "Neural Coding Studio",
      description:
        "Generate, refactor, and explain software components. Supports 30+ languages with advanced type safety checks and logical optimizations.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDbwAxdM5kHtiuBIDs-_ELetBkwGYMSP0smu8tTpptgjrNc6S1ExVunwmyjaih_EVkIVPikDRzIM_2HCmQdbks0ceYOq_rgy5BjcTkzlu2-mypWVhDJmZipxnKwveM0pS6rTFBAJ7swV-HQko3JW9B-h4xM52Jt-mWUwh0q7au6wKJbsds_K2d69ZzjuVA1i3Sck4iEgFbNKR2uJICq9Tkc6BYklBTNPdZZLWVEyqmzoq-hENkkK_MbSivsmJmSaXW4MJLuYsF4aUKG",
    },
    {
      id: "data",
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      title: "Data Intelligence",
      description:
        "Extract actionable metrics, summarize voluminous spreadsheets, and draw visual insights from complex relational logs.",
    },
    {
      id: "collab",
      icon: <Users2 className="w-5 h-5 text-pink-400" />,
      title: "Seamless Team Collaboration",
      description:
        "Share workspaces, synchronize prompts, and audit usage across your organization. Enterprise security configured natively.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Connect & Sync",
      desc: "Instantly link your files, codebase, or document store into Alvira's secure local workspace.",
    },
    {
      num: "02",
      title: "Prompt & Create",
      desc: "Leverage Alvira's advanced model ecosystem to synthesize summaries, code files, or analytics dashboards.",
    },
    {
      num: "03",
      title: "Optimize & Deploy",
      desc: "Refine outputs, verify runtime syntax, and deploy polished results straight to production pipelines.",
    },
  ];

  const faqs = [
    {
      q: "What is Alvira AI?",
      a: "Alvira AI is a next-generation intelligence-led productivity platform that integrates contextual writing assistant tools, neural programming studios, and spreadsheet-to-insights data crunchers in a cohesive, unified workspace.",
    },
    {
      q: "Is my corporate data secure?",
      a: "Yes. Alvira employs bank-grade, fully isolated server-side processes. Your files, uploads, and chat inputs are never cached or utilized to train future public model layers.",
    },
    {
      q: "How does the token allocation work?",
      a: "Tokens correspond to the semantic volume of text or code processed. The Pro tier includes a generous allocation of 1M tokens/month, which dynamically regenerates. Usage status is visible in real-time on your main dashboard.",
    },
    {
      q: "Can I customize the model being used?",
      a: "Absolutely. In the AI Chat workstation, you can instantly hot-swap between our blazing-fast Alvira-1 utility model and our reasoning-intensive, state-of-the-art Alvira-Pro engine.",
    },
  ];

  const scrollSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#0b0c10] text-[#c5c6c7] font-sans min-h-screen selection:bg-purple-600 selection:text-white" id="landing-container">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0c10]/90 backdrop-blur-md border-b border-purple-950/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollSection("hero")}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuUZdduHPeVBhH172qlFSuPIREmM67D_QdrLNLd-GOUrG457VWZpbdoWsj62hHKDWs-QZMJH4Ogw7YHeVF9OY8EdZEX7BS1U4sO8J7HjQyzHSzfzVQwABiyi5C0Mz45u58BZFMtykONIPpWhrzNcSP7CXvU6j49a3mIsV5vrp_zzs__5SQn2WoLbObDDUQVG4MpYUW_xoXrnq--DpV80izJkiXPZZsMWOkuYJxzfvRO_wYiZapNGia5l3mrndlKv3KXYHnCmqKbUrZ"
              alt="Alvira Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold tracking-wider text-white">ALVIRA AI</span>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => scrollSection("features")}
              className="hover:text-purple-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={onNavigateToPricing}
              className="hover:text-purple-400 transition-colors"
            >
              Pricing
            </button>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollSection("how-it-works");
              }}
              className="hover:text-purple-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollSection("faq");
              }}
              className="hover:text-purple-400 transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Nav Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm font-medium hover:text-white transition-colors"
            >
              Log In
            </button>
            <button
              onClick={handleRegisterClick}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-purple-900/30 hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0f1016] border-b border-purple-950/50 p-6 flex flex-col gap-4 shadow-xl">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollSection("features");
              }}
              className="text-left py-2 hover:text-purple-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToPricing();
              }}
              className="text-left py-2 hover:text-purple-400 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollSection("how-it-works");
              }}
              className="text-left py-2 hover:text-purple-400 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollSection("faq");
              }}
              className="text-left py-2 hover:text-purple-400 transition-colors"
            >
              FAQ
            </button>
            <div className="h-[1px] bg-purple-950/30 my-2"></div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogin();
              }}
              className="py-2.5 text-center text-sm font-semibold rounded-lg hover:bg-purple-950/10 transition"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleRegisterClick();
              }}
              className="py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-center text-sm font-semibold shadow-lg shadow-purple-900/20"
            >
              Get Started Free
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full filter blur-[150px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-600/10 rounded-full filter blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-950/30 border border-purple-500/20 rounded-full text-xs font-semibold text-purple-400 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Empowering 20k+ Builders & Knowledge Workers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight"
          >
            Your Intelligent AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-emerald-400">
              Productivity Assistant
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-[#8b8e99] max-w-2xl font-light"
          >
            Slay document backlog, optimize engineering pipelines, and extract data-driven insights in a unified, beautifully premium web interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleRegisterClick}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-xl shadow-purple-900/30 hover:opacity-95 hover:shadow-purple-900/40 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onNavigateToPricing}
              className="w-full sm:w-auto px-8 py-4 bg-[#1f2029]/80 text-white font-semibold rounded-xl border border-purple-950/45 hover:bg-[#252733] transition-colors"
            >
              View Pricing plans
            </button>
          </motion.div>

          {/* Product Showcase mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 w-full max-w-5xl rounded-2xl overflow-hidden border border-purple-950/40 shadow-2xl shadow-purple-950/20 bg-[#16171f]"
          >
            <div className="bg-[#0f1016] border-b border-purple-950/35 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="text-xs text-[#8b8e99] ml-4 select-none">https://app.alvira.ai/dashboard</div>
            </div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCailu6G1mk07tivXdUZXz53sAOqdasqYPX11Z1uWoRT2wYHX_4tUqEAhFHJiiuf4vACcIET9EEvZ6QzPHPEjCDMrMzeRWyDrS7bw5M8NY2SzTr1a3smEcnptOQgQga4Z_TsNGUlM_htwuG3YYr60SDnf-OpaT2d7o7o57ZmnSdeE2TozBiAV55b31v1g98FUMiuJ4Z1MdCqNsS1eTvpNK25NCV_YfsFsGnSYJ_XwN023UPUWq1W9hYkTJH7peMZrDtdhn-AsrwqpgH"
              alt="Alvira Dashboard Showcase"
              className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 px-6 border-t border-purple-950/20 bg-[#0f1016]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              One Workspace. Infinite Capabilities.
            </h2>
            <p className="mt-4 text-[#8b8e99] max-w-xl mx-auto font-light">
              Stop juggling 10 different subscription apps. Alvira integrates your core intelligence needs in one premium, high-speed ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento Block 1: Masterful Writing */}
            <div className="col-span-1 md:col-span-2 rounded-2xl bg-[#16171f] border border-purple-950/25 p-8 flex flex-col md:flex-row gap-8 items-center overflow-hidden hover:border-purple-800/40 transition">
              <div className="flex-1">
                <div className="p-3 bg-purple-950/30 w-fit rounded-lg mb-4">
                  {features[0].icon}
                </div>
                <h3 className="text-xl font-bold text-white">{features[0].title}</h3>
                <p className="mt-3 text-sm text-[#8b8e99] leading-relaxed">
                  {features[0].description}
                </p>
                <button
                  onClick={onLogin}
                  className="mt-6 text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
                >
                  Start drafting copy{" "}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              <div className="flex-1 w-full max-w-[320px] rounded-xl overflow-hidden border border-purple-950/30">
                <img
                  src={features[0].image}
                  alt="Writing Assistant Mockup"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Bento Block 2: Neural Coding */}
            <div className="col-span-1 rounded-2xl bg-[#16171f] border border-purple-950/25 p-8 flex flex-col justify-between hover:border-blue-800/40 transition">
              <div>
                <div className="p-3 bg-blue-950/30 w-fit rounded-lg mb-4">
                  {features[1].icon}
                </div>
                <h3 className="text-xl font-bold text-white">{features[1].title}</h3>
                <p className="mt-3 text-sm text-[#8b8e99] leading-relaxed">
                  {features[1].description}
                </p>
              </div>
              <div className="mt-6 rounded-xl overflow-hidden border border-blue-950/30 max-h-[140px]">
                <img
                  src={features[1].image}
                  alt="Neural Code Screenshot"
                  className="w-full h-auto object-cover object-top scale-105"
                />
              </div>
            </div>

            {/* Bento Block 3: Data Intelligence */}
            <div className="col-span-1 rounded-2xl bg-[#16171f] border border-purple-950/25 p-8 flex flex-col justify-between hover:border-emerald-800/40 transition">
              <div>
                <div className="p-3 bg-emerald-950/30 w-fit rounded-lg mb-4">
                  {features[2].icon}
                </div>
                <h3 className="text-xl font-bold text-white">{features[2].title}</h3>
                <p className="mt-3 text-sm text-[#8b8e99] leading-relaxed">
                  {features[2].description}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-purple-950/20 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Ready to analyze logs
                </span>
                <span className="text-xs text-[#8b8e99] cursor-pointer hover:text-white" onClick={onLogin}>Try tool →</span>
              </div>
            </div>

            {/* Bento Block 4: Seamless Collaboration */}
            <div className="col-span-1 md:col-span-2 rounded-2xl bg-[#16171f] border border-purple-950/25 p-8 flex flex-col justify-between hover:border-pink-800/40 transition">
              <div>
                <div className="p-3 bg-pink-950/30 w-fit rounded-lg mb-4">
                  {features[3].icon}
                </div>
                <h3 className="text-xl font-bold text-white">{features[3].title}</h3>
                <p className="mt-3 text-sm text-[#8b8e99] leading-relaxed">
                  {features[3].description}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="px-2.5 py-1 bg-[#1a1c29] rounded text-xs text-pink-400 font-medium">Auto-Sync</span>
                <span className="px-2.5 py-1 bg-[#1a1c29] rounded text-xs text-pink-400 font-medium">Organization Vaults</span>
                <span className="px-2.5 py-1 bg-[#1a1c29] rounded text-xs text-pink-400 font-medium">Fine-tuned Permissions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Pipeline Process */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0b0c10]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Sleek Workflow Pipeline
            </h2>
            <p className="mt-4 text-[#8b8e99] max-w-md mx-auto font-light">
              How Alvira supercharges your delivery timeline from ideation to production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 z-0"></div>

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center p-6 bg-[#16171f]/40 border border-purple-950/15 rounded-2xl hover:border-purple-800/20 transition duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20 flex items-center justify-center text-xl font-mono font-bold text-purple-400 mb-6 shadow-md">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm text-[#8b8e99] leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#0f1016] border-t border-purple-950/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Trust of Tech Innovators</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#16171f] p-8 rounded-2xl border border-purple-950/20 flex flex-col justify-between">
              <p className="text-sm text-[#8b8e99] leading-relaxed italic">
                &ldquo;Implementing Alvira's Neural Coding modules cut our refactoring cycle by 40%. The capability to feed in complete repository files server-side and analyze structure instantly is unmatched in other products.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-5U3aZUUzCNV65b6HhDYbcYD7-OYk0-poI5uAVEothcdScvqjvyXcPFnl8BuLC4axaYLwQ0W1mld1nlhsvH_N-nPRXORYZISAT_Jep9BSacYI0gwqWgjoSOy-XTwrid2U5p6V1lOvXl3joz4NFvKD_9lOJO4KfNWP0pf2B6Krum2UPVMOmOK7mGpM2s9LFnpQiPtoCHX-qufceJfavUsZfeTl6ctEhDhAoPb3De1dwLoQchCWb_YWdp3_aqgvESbe5cOuuXWjGnv9"
                  alt="Sarah Jenkins portrait"
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">Sarah Jenkins</h4>
                  <p className="text-xs text-purple-400">CTO at TechFlow</p>
                </div>
              </div>
            </div>

            <div className="bg-[#16171f] p-8 rounded-2xl border border-purple-950/20 flex flex-col justify-between">
              <p className="text-sm text-[#8b8e99] leading-relaxed italic">
                &ldquo;As a product manager, I synthesize dozens of documents a week. Alvira's custom summarization pipelines distill complex user telemetry logs into bulleted summaries perfectly conforming to our internal Jira tickets.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgbYMLZXHUC_EfeCV6EOAjpI4TJ1IxaVaBX6hUTQh3ctsieIYxdHLCDdFPRUtuG7cArnxA8-51kklrwmKVOlA-9e3srz68gwhZEb69y_fdaKy2JOpK6SLqV1MDruOEO02_VvPKNPepYBZAXeqfD2wKr2x4O2pJ4QcuiDZD1Cpucs4jnzRDyTU3saIzEuTHiEUXbkHuU7flZMC2N4U6NGA_052JycXvda6q_orSLzxx-NjVg659XsGcICp_j5jelpo1gYgPEZWYMBpX"
                  alt="Marcus Thorne portrait"
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">Marcus Thorne</h4>
                  <p className="text-xs text-purple-400">Principal Architect at LunarLabs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Preview) */}
      <section id="pricing-preview" className="py-24 px-6 bg-[#0b0c10] border-t border-purple-950/15">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Flexible, Performance-led Pricing</h2>
            <p className="mt-4 text-[#8b8e99] max-w-sm mx-auto font-light">
              Get premium utility tokens scaled to your workflow volume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-[#16171f]/50 p-8 rounded-2xl border border-purple-950/15 flex flex-col justify-between hover:border-purple-800/10 transition">
              <div>
                <h3 className="text-lg font-bold text-white">Starter</h3>
                <p className="text-xs text-[#8b8e99] mt-1">Excellent for evaluation</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-[#8b8e99] ml-1">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-[#8b8e99]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    100k free monthly tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Access to Alvira-1 Model
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Single workspace profile
                  </li>
                </ul>
              </div>
              <button onClick={handleRegisterClick} className="mt-8 w-full py-3 bg-[#1f2029] text-white font-semibold rounded-lg hover:bg-[#252733] transition text-sm">
                Get Started
              </button>
            </div>

            {/* Pro - Featured */}
            <div className="bg-[#16171f] p-8 rounded-2xl border-2 border-purple-600 relative flex flex-col justify-between shadow-xl shadow-purple-950/20">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white rounded-full text-[10px] font-bold tracking-wider uppercase">
                Most Popular
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Pro Studio</h3>
                <p className="text-xs text-purple-400 mt-1">For power knowledge workers</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$29</span>
                  <span className="text-xs text-[#8b8e99] ml-1">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-[#c5c6c7]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    1.5 Million monthly tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Full access to Alvira-Pro engine
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Advanced Neural Code Studio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    LingoFlow Translator Hub
                  </li>
                </ul>
              </div>
              <button onClick={handleRegisterClick} className="mt-8 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition text-sm shadow-md">
                Upgrade to Pro
              </button>
            </div>

            {/* Business */}
            <div className="bg-[#16171f]/50 p-8 rounded-2xl border border-purple-950/15 flex flex-col justify-between hover:border-purple-800/10 transition">
              <div>
                <h3 className="text-lg font-bold text-white">Team Enterprise</h3>
                <p className="text-xs text-[#8b8e99] mt-1">For growing teams & scaleups</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$99</span>
                  <span className="text-xs text-[#8b8e99] ml-1">/ month</span>
                </div>
                <ul className="mt-8 space-y-4 text-xs text-[#8b8e99]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    5 Million shared monthly tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Interactive workspace synchronization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Dedicated priority server threads
                  </li>
                </ul>
              </div>
              <button onClick={handleRegisterClick} className="mt-8 w-full py-3 bg-[#1f2029] text-white font-semibold rounded-lg hover:bg-[#252733] transition text-sm">
                Inquire For Teams
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button onClick={onNavigateToPricing} className="text-xs text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1">
              View Detailed Plan Comparison Table <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-[#0f1016]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#16171f] rounded-xl border border-purple-950/25 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center text-white font-medium hover:bg-purple-950/5 transition-colors"
                >
                  <span className="text-sm md:text-base">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${activeFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#8b8e99] border-t border-purple-950/15 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-950/20 via-[#0b0c10] to-[#0b0c10] border-t border-purple-950/10 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Ready to Amplify Your Daily Output?
          </h2>
          <p className="mt-4 text-[#8b8e99] font-light max-w-xl mx-auto">
            Ditch the mundane. Set up your Alvira workspace in under 30 seconds and reclaim hours of deep focus.
          </p>
          <button
            onClick={handleRegisterClick}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-xl shadow-purple-900/30 hover:opacity-95 hover:shadow-purple-900/40 transition-all inline-flex items-center gap-2"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b0c10] border-t border-purple-950/20 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuUZdduHPeVBhH172qlFSuPIREmM67D_QdrLNLd-GOUrG457VWZpbdoWsj62hHKDWs-QZMJH4Ogw7YHeVF9OY8EdZEX7BS1U4sO8J7HjQyzHSzfzVQwABiyi5C0Mz45u58BZFMtykONIPpWhrzNcSP7CXvU6j49a3mIsV5vrp_zzs__5SQn2WoLbObDDUQVG4MpYUW_xoXrnq--DpV80izJkiXPZZsMWOkuYJxzfvRO_wYiZapNGia5l3mrndlKv3KXYHnCmqKbUrZ"
              alt="Alvira Logo"
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-semibold tracking-wider text-white">ALVIRA AI</span>
          </div>
          <p className="text-xs text-[#8b8e99]">
            &copy; 2026 Alvira AI Technologies Inc. All rights reserved. Built secure in AI Studio Workspace.
          </p>
        </div>
      </footer>
    </div>
  );
}
