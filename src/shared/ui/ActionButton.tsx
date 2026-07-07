import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
};

export function ActionButton({
  icon,
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
