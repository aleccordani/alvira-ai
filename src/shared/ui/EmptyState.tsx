import { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
};

export function EmptyState({ icon, title, description }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-purple-950/30 bg-[#12131a] p-6 text-center">
      {icon && (
        <div className="mb-3 flex justify-center text-purple-300">{icon}</div>
      )}

      <h3 className="text-sm font-bold text-white">{title}</h3>

      {description && (
        <p className="mt-2 text-xs text-gray-400">{description}</p>
      )}
    </div>
  );
}
