import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function SectionCard({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl border border-purple-950/20 bg-[#16171f] ${className}`}
    >
      {children}
    </div>
  );
}
