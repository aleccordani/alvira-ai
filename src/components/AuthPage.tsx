import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  Check,
  AlertCircle,
  Globe,
  Loader2,
  FileText,
  Github,
  Apple,
} from "lucide-react";
import { UserProfile } from "../types";
import { loginRequest, registerRequest } from "@/services/auth";
import { saveToken } from "@/lib/token";

interface AuthPageProps {
  onSuccess: (updatedUser: Partial<UserProfile>) => void;
  onBack: () => void;
  initialMode?: "login" | "register";
}

type LangType = "id" | "en";

export default function AuthPage({
  onSuccess,
  onBack,
  initialMode = "login",
}: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [lang, setLang] = useState<LangType>("id");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("AI Enthusiast & Developer");
  const [role, setRole] = useState("developer");

  // Error & loading states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [customSteps, setCustomSteps] = useState<string[]>([]);

  // Password requirements checklist (Register mode)
  const isLengthValid = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "bg-gray-800", percentage: 0 };
    let score = 0;
    if (isLengthValid) score += 33;
    if (hasNumber) score += 33;
    if (hasSpecial) score += 34;

    if (score <= 33)
      return {
        label: lang === "id" ? "Lemah" : "Weak",
        color: "bg-red-500",
        percentage: 33,
      };
    if (score <= 66)
      return {
        label: lang === "id" ? "Sedang" : "Medium",
        color: "bg-yellow-500",
        percentage: 66,
      };
    return {
      label: lang === "id" ? "Sangat Kuat" : "Very Strong",
      color: "bg-emerald-500",
      percentage: 100,
    };
  };

  const strength = getPasswordStrength();

  // Multi-step animated loading prompts
  const loadingStepsEn = [
    "Establishing secure pipeline...",
    "Decrypting user context...",
    "Optimizing LLM token caching engine...",
    "Finalizing workspace initialization...",
  ];

  const loadingStepsId = [
    "Menghubungkan jalur aman...",
    "Mendekripsi konteks pengguna...",
    "Mengoptimalkan mesin cache token LLM...",
    "Menyelesaikan inisialisasi ruang kerja...",
  ];

  const steps = lang === "id" ? loadingStepsId : loadingStepsEn;

  const handleSocialLogin = (provider: "google" | "apple" | "github") => {
    setError("");
    setIsLoading(true);
    setLoadingStep(0);

    const providerStepsEn = {
      google: [
        "Connecting with Google Secure Gateway...",
        "Authorizing OAuth scopes for Google Identity...",
        "Retrieving user profile info...",
        "Setting up Alvira workspace...",
      ],
      apple: [
        "Initializing Apple ID Authorization Client...",
        "Verifying Apple Private Relay Session...",
        "Retrieving tokenized profile metadata...",
        "Setting up Alvira workspace...",
      ],
      github: [
        "Connecting with GitHub OAuth Secure Gate...",
        "Authenticating secure access token...",
        "Retrieving developer & repository metadata...",
        "Setting up Alvira workspace...",
      ],
    };

    const providerStepsId = {
      google: [
        "Menghubungkan dengan Gerbang Aman Google...",
        "Mengotorisasi cakupan OAuth untuk Google Identity...",
        "Mengambil info profil pengguna...",
        "Menyiapkan ruang kerja Alvira...",
      ],
      apple: [
        "Menginisialisasi Klien Otorisasi Apple ID...",
        "Memverifikasi Sesi Relai Privat Apple...",
        "Mengambil metadata profil yang ditokenisasi...",
        "Menyiapkan ruang kerja Alvira...",
      ],
      github: [
        "Menghubungkan dengan Gerbang Aman OAuth GitHub...",
        "Mengautentikasi token akses aman...",
        "Mengambil metadata pengembang & repositori...",
        "Menyiapkan ruang kerja Alvira...",
      ],
    };

    const activeSteps =
      lang === "id" ? providerStepsId[provider] : providerStepsEn[provider];
    setCustomSteps(activeSteps);

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= activeSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsLoading(false);

            let nameVal = "Alex Rivera";
            let emailVal = "alex.rivera@alvira.ai";
            let bioVal = "Principal Solutions Architect at TechFlow.";
            let avatarVal =
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAgbYMLZXHUC_EfeCV6EOAjpI4TJ1IxaVaBX6hUTQh3ctsieIYxdHLCDdFPRUtuG7cArnxA8-51kklrwmKVOlA-9e3srz68gwhZEb69y_fdaKy2JOpK6SLqV1MDruOEO02_VvPKNPepYBZAXeqfD2wKr2x4O2pJ4QcuiDZD1Cpucs4jnzRDyTU3saIzEuTHiEUXbkHuU7flZMC2N4U6NGA_052JycXvda6q_orSLzxx-NjVg659XsGcICp_j5jelpo1gYgPEZWYMBpX";

            if (provider === "google") {
              nameVal = "Dani Muhammad";
              emailVal = "muhmmddani10@gmail.com";
              bioVal = "Google Cloud Certified Developer & AI enthusiast.";
              avatarVal =
                "https://api.dicebear.com/7.x/pixel-art/svg?seed=dani";
            } else if (provider === "apple") {
              nameVal = "Alex Appleby";
              emailVal = "alex.appleby@privaterelay.appleid.com";
              bioVal = "Developer on Apple Ecosystem using Swift & React.";
              avatarVal = "https://api.dicebear.com/7.x/bottts/svg?seed=apple";
            } else if (provider === "github") {
              nameVal = "dani-github";
              emailVal = "muhmmddani10@users.noreply.github.com";
              bioVal = "Fullstack developer | Open source contributor.";
              avatarVal =
                "https://api.dicebear.com/7.x/identicon/svg?seed=github-dani";
            }

            onSuccess({
              name: nameVal,
              email: emailVal,
              bio: bioVal,
              avatarUrl: avatarVal,
            });
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError(
        lang === "id" ? "Alamat email tidak valid." : "Invalid email address.",
      );
      return;
    }

    if (password.length < 8) {
      setError(
        lang === "id"
          ? "Kata sandi minimal harus 8 karakter."
          : "Password must be at least 8 characters long.",
      );
      return;
    }

    if (mode === "register" && !name.trim()) {
      setError(
        lang === "id" ? "Nama lengkap wajib diisi." : "Full name is required.",
      );
      return;
    }

    try {
      setCustomSteps(steps);
      setIsLoading(true);
      setLoadingStep(0);

      const response =
        mode === "login"
          ? await loginRequest(email, password)
          : await registerRequest(name, email, password);

      const token = response.data.token;
      const user = response.data.user;

      saveToken(token);

      onSuccess({
        name: user.name,
        email: user.email,
        bio: "Alvira AI User",
        avatarUrl:
          user.avatar ??
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`,
      });
    } catch (error) {
      setError(
        mode === "login"
          ? lang === "id"
            ? "Email atau kata sandi salah."
            : "Invalid email or password."
          : lang === "id"
            ? "Gagal membuat akun."
            : "Failed to create account.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    id: {
      loginTitle: "Masuk ke Akun Anda",
      loginSubtitle: "Akses asisten produktivitas AI Alvira",
      registerTitle: "Daftar Akun Baru",
      registerSubtitle: "Mulailah dengan 1.5M token gratis di akun Pro",
      emailLabel: "Alamat Email",
      passwordLabel: "Kata Sandi",
      nameLabel: "Nama Lengkap",
      bioLabel: "Bio Ringkas / Deskripsi Diri",
      roleLabel: "Peran Utama Anda",
      developer: "Pengembang Perangkat Lunak",
      designer: "Desainer UI/UX",
      manager: "Manajer Produk / Bisnis",
      student: "Mahasiswa / Pelajar",
      forgotPassword: "Lupa kata sandi?",
      loginBtn: "Masuk Sekarang",
      registerBtn: "Daftar & Mulai",
      noAccount: "Belum punya akun?",
      haveAccount: "Sudah punya akun?",
      toggleRegister: "Daftar Akun Baru",
      toggleLogin: "Masuk ke Akun Lama",
      loadingHeader: "Mengautentikasi...",
      secureNode: "Simulasi Node-Keamanan Alvira diaktifkan",
      reqLength: "Minimal 8 karakter",
      reqNum: "Mengandung angka (0-9)",
      reqSpecial: "Mengandung simbol khusus (@, #, !, dll.)",
      passwordStrength: "Kekuatan Kata Sandi:",
      backToHome: "Kembali ke Beranda",
      orSeparator: "Atau lanjutkan dengan",
      googleLogin: "Google",
      appleLogin: "Apple",
      githubLogin: "GitHub",
    },
    en: {
      loginTitle: "Sign In to Your Account",
      loginSubtitle: "Access your Alvira AI productivity workstation",
      registerTitle: "Create Your Account",
      registerSubtitle: "Get started with 1.5M monthly tokens on Pro",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      nameLabel: "Full Name",
      bioLabel: "Short Bio / Occupation",
      roleLabel: "Your Primary Role",
      developer: "Software Developer",
      designer: "UI/UX Designer",
      manager: "Product / Business Manager",
      student: "Student / Researcher",
      forgotPassword: "Forgot password?",
      loginBtn: "Sign In Now",
      registerBtn: "Register & Get Started",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      toggleRegister: "Create an Account",
      toggleLogin: "Sign In Instead",
      loadingHeader: "Authenticating Secure Session...",
      secureNode: "Alvira Security-Node emulation active",
      reqLength: "At least 8 characters",
      reqNum: "Contains a number (0-9)",
      reqSpecial: "Contains special character (@, #, !, etc.)",
      passwordStrength: "Password Strength:",
      backToHome: "Back to Home",
      orSeparator: "Or continue with",
      googleLogin: "Google",
      appleLogin: "Apple",
      githubLogin: "GitHub",
    },
  };

  const t = translations[lang];

  return (
    <div
      className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans relative flex flex-col justify-between overflow-y-auto selection:bg-purple-600 selection:text-white"
      id="auth-container"
    >
      {/* Background visual graphics */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-purple-950/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* Top Header / Language Switcher */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-[#8b8e99] hover:text-white transition duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>

        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-purple-400" />
          <div className="bg-[#16171f] border border-purple-950/30 rounded-lg p-0.5 flex">
            <button
              onClick={() => setLang("id")}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                lang === "id"
                  ? "bg-purple-600 text-white"
                  : "text-[#8b8e99] hover:text-white"
              }`}
            >
              ID
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                lang === "en"
                  ? "bg-purple-600 text-white"
                  : "text-[#8b8e99] hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main card section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-lg bg-[#16171f] border border-purple-950/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative side accent glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl"></div>

          <AnimatePresence mode="wait">
            {!isLoading ? (
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "login" ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "login" ? 15 : -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Branding */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="p-3 bg-purple-950/40 rounded-2xl border border-purple-500/25 mb-4 shadow-lg shadow-purple-950/40">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuUZdduHPeVBhH172qlFSuPIREmM67D_QdrLNLd-GOUrG457VWZpbdoWsj62hHKDWs-QZMJH4Ogw7YHeVF9OY8EdZEX7BS1U4sO8J7HjQyzHSzfzVQwABiyi5C0Mz45u58BZFMtykONIPpWhrzNcSP7CXvU6j49a3mIsV5vrp_zzs__5SQn2WoLbObDDUQVG4MpYUW_xoXrnq--DpV80izJkiXPZZsMWOkuYJxzfvRO_wYiZapNGia5l3mrndlKv3KXYHnCmqKbUrZ"
                      alt="Alvira Logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <h1 className="text-xl font-extrabold text-white tracking-tight">
                    {mode === "login" ? t.loginTitle : t.registerTitle}
                  </h1>
                  <p className="text-xs text-[#8b8e99] mt-2 max-w-sm">
                    {mode === "login" ? t.loginSubtitle : t.registerSubtitle}
                  </p>
                </div>

                {/* Social logins */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("google")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0b0c10] border border-purple-950/20 hover:border-purple-600/50 rounded-xl text-xs font-semibold text-white transition duration-200 cursor-pointer shadow-sm hover:shadow-purple-950/30"
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>{t.googleLogin}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin("apple")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0b0c10] border border-purple-950/20 hover:border-purple-600/50 rounded-xl text-xs font-semibold text-white transition duration-200 cursor-pointer shadow-sm hover:shadow-purple-950/30"
                  >
                    <Apple className="w-4 h-4 text-white shrink-0" />
                    <span>{t.appleLogin}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin("github")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0b0c10] border border-purple-950/20 hover:border-purple-600/50 rounded-xl text-xs font-semibold text-white transition duration-200 cursor-pointer shadow-sm hover:shadow-purple-950/30"
                  >
                    <Github className="w-4 h-4 text-white shrink-0" />
                    <span>{t.githubLogin}</span>
                  </button>
                </div>

                {/* Separator */}
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-950/15"></div>
                  </div>
                  <span className="relative px-3 bg-[#16171f] text-[9px] text-[#8b8e99] uppercase tracking-wider font-bold">
                    {t.orSeparator}
                  </span>
                </div>

                {/* Form feedback error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 bg-red-950/20 border border-red-500/30 p-3.5 rounded-xl flex items-center gap-2.5 text-xs text-red-300"
                  >
                    <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Standard forms */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "register" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      {/* Name input */}
                      <div>
                        <label className="text-[10px] font-bold text-[#8b8e99] uppercase tracking-wider block mb-1.5">
                          {t.nameLabel}
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-[#8b8e99]" />
                          <input
                            type="text"
                            placeholder={
                              lang === "id"
                                ? "Contoh: Alex Rivera"
                                : "e.g., Alex Rivera"
                            }
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#0b0c10] border border-purple-950/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-purple-600 transition"
                          />
                        </div>
                      </div>

                      {/* Bio input */}
                      <div>
                        <label className="text-[10px] font-bold text-[#8b8e99] uppercase tracking-wider block mb-1.5">
                          {t.bioLabel}
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 w-4 h-4 text-[#8b8e99]" />
                          <input
                            type="text"
                            placeholder={
                              lang === "id"
                                ? "Contoh: Principal Developer di Alvira"
                                : "e.g., Principal Developer at Alvira"
                            }
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-[#0b0c10] border border-purple-950/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-purple-600 transition"
                          />
                        </div>
                      </div>

                      {/* Role selection dropdown */}
                      <div>
                        <label className="text-[10px] font-bold text-[#8b8e99] uppercase tracking-wider block mb-1.5">
                          {t.roleLabel}
                        </label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full bg-[#0b0c10] border border-purple-950/30 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-purple-600 transition appearance-none cursor-pointer"
                        >
                          <option value="developer">{t.developer}</option>
                          <option value="designer">{t.designer}</option>
                          <option value="manager">{t.manager}</option>
                          <option value="student">{t.student}</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className="text-[10px] font-bold text-[#8b8e99] uppercase tracking-wider block mb-1.5">
                      {t.emailLabel}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-[#8b8e99]" />
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0b0c10] border border-purple-950/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-purple-600 transition"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] font-bold text-[#8b8e99] uppercase tracking-wider block">
                        {t.passwordLabel}
                      </label>
                      {mode === "login" && (
                        <button
                          type="button"
                          className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition"
                        >
                          {t.forgotPassword}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-[#8b8e99]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0b0c10] border border-purple-950/30 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-purple-600 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-[#8b8e99] hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password helper & strength bar in Register mode */}
                  {mode === "register" && password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 bg-[#0b0c10]/40 p-3 rounded-xl border border-purple-950/10 space-y-2.5"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#8b8e99]">
                          {t.passwordStrength}
                        </span>
                        <span className="font-bold text-white">
                          {strength.label}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-950/40 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${strength.percentage}%` }}
                        ></div>
                      </div>

                      {/* Checklist */}
                      <ul className="text-[10px] space-y-1 mt-1 text-[#8b8e99]">
                        <li className="flex items-center gap-1.5">
                          <span
                            className={`p-0.5 rounded-full ${
                              isLengthValid
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-purple-950/20 text-purple-600"
                            }`}
                          >
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span
                            className={
                              isLengthValid
                                ? "text-emerald-400 font-semibold"
                                : ""
                            }
                          >
                            {t.reqLength}
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className={`p-0.5 rounded-full ${
                              hasNumber
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-purple-950/20 text-purple-600"
                            }`}
                          >
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span
                            className={
                              hasNumber ? "text-emerald-400 font-semibold" : ""
                            }
                          >
                            {t.reqNum}
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className={`p-0.5 rounded-full ${
                              hasSpecial
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-purple-950/20 text-purple-600"
                            }`}
                          >
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span
                            className={
                              hasSpecial ? "text-emerald-400 font-semibold" : ""
                            }
                          >
                            {t.reqSpecial}
                          </span>
                        </li>
                      </ul>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-950/30 hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{mode === "login" ? t.loginBtn : t.registerBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Account toggle link */}
                <div className="mt-6 pt-5 border-t border-purple-950/25 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
                  <span className="text-[#8b8e99]">
                    {mode === "login" ? t.noAccount : t.haveAccount}
                  </span>
                  <button
                    onClick={() => {
                      setError("");
                      setMode(mode === "login" ? "register" : "login");
                    }}
                    className="text-purple-400 hover:text-purple-300 font-bold transition flex items-center gap-1"
                  >
                    <span>
                      {mode === "login" ? t.toggleRegister : t.toggleLogin}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Simulated high-fidelity multi-step verification sequence */
              <motion.div
                key="loading-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="relative mb-8">
                  <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuUZdduHPeVBhH172qlFSuPIREmM67D_QdrLNLd-GOUrG457VWZpbdoWsj62hHKDWs-QZMJH4Ogw7YHeVF9OY8EdZEX7BS1U4sO8J7HjQyzHSzfzVQwABiyi5C0Mz45u58BZFMtykONIPpWhrzNcSP7CXvU6j49a3mIsV5vrp_zzs__5SQn2WoLbObDDUQVG4MpYUW_xoXrnq--DpV80izJkiXPZZsMWOkuYJxzfvRO_wYiZapNGia5l3mrndlKv3KXYHnCmqKbUrZ"
                      alt="Alvira Logo"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>

                <h2 className="text-base font-extrabold text-white tracking-tight mb-2">
                  {t.loadingHeader}
                </h2>

                {/* Staggered progress steps */}
                <div className="w-full max-w-xs mt-4">
                  <div className="text-[10px] font-mono text-purple-400 h-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={loadingStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {steps[loadingStep]}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Horizontal visual indicator bar */}
                  <div className="w-full h-1 bg-[#0b0c10] rounded-full mt-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${((loadingStep + 1) / steps.length) * 100}%`,
                      }}
                      transition={{ duration: 0.8 }}
                    ></motion.div>
                  </div>
                </div>

                <div className="mt-8 text-[9px] font-mono text-[#8b8e99]">
                  ● {t.secureNode}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-purple-950/10 text-center text-[10px] text-[#8b8e99] relative z-10">
        &copy; 2026 Alvira AI Technologies Inc. All rights reserved. Encrypted
        end-to-end.
      </footer>
    </div>
  );
}
