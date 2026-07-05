import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:from-purple-500 hover:to-violet-400",
        secondary:
          "border border-[#2A2E40] bg-[#171923] text-white hover:border-purple-500/60 hover:bg-[#1E2130]",
        ghost: "text-gray-300 hover:bg-white/5 hover:text-white",
        danger: "bg-red-500/15 text-red-400 hover:bg-red-500/25",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
