type Props = {
  className?: string;
};

export default function LoadingSkeleton({ className = "" }: Props) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/5 border border-purple-950/20 ${className}`}
    />
  );
}
