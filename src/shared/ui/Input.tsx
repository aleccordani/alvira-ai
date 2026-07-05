import type { InputHTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}

      <input
        className={cn(
          "w-full rounded-xl border border-[#2A2E40] bg-[#171923] px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-all",
          "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className,
        )}
        {...props}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
