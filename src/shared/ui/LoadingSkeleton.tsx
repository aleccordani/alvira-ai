type Props = {
  className?: string;
};

export function LoadingSkeleton({ className = "" }: Props) {
  return <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />;
}
