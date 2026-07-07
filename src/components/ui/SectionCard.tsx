import type { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
    >
      {icon && <div className="mb-4 text-purple-500/70">{icon}</div>}

      <h4 className="text-white font-semibold">{title}</h4>

      {description && (
        <p className="text-[#8b8e99] text-sm mt-2 max-w-sm">{description}</p>
      )}
    </div>
  );
}
