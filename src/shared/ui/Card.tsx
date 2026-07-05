import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const cardVariants = cva("rounded-2xl border transition-all duration-200", {
  variants: {
    variant: {
      default:
        "border-[#25283A] bg-[#151722] text-white shadow-[0_20px_40px_rgba(0,0,0,0.28)]",
      glass:
        "border-white/10 bg-white/[0.04] text-white backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.35)]",
      gradient:
        "border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-[#151722] to-[#0B0D14] text-white shadow-[0_0_40px_rgba(139,92,246,0.16)]",
      interactive:
        "border-[#25283A] bg-[#151722] text-white shadow-[0_20px_40px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 hover:border-purple-500/60 hover:bg-[#1B1E2B]",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-5",
      lg: "p-6",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}
