import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:opacity-90",
  secondary:
    "bg-[#16171f] border border-purple-950/30 text-white hover:border-purple-600/50",
  danger:
    "bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20",
};

export default function ActionButton({
  children,
  variant = "secondary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
