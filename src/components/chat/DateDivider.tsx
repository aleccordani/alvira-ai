type Props = {
  label: string;
};

export default function DateDivider({ label }: Props) {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="h-px flex-1 bg-purple-950/20" />

      <span className="rounded-full border border-purple-500/10 bg-[#16171f] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7b7f8c]">
        {label}
      </span>

      <div className="h-px flex-1 bg-purple-950/20" />
    </div>
  );
}
