import { cn } from "@/src/lib/cn";

/**
 * A single shimmer block. Loading screens are composed from these so they
 * match the layout of the page they stand in for.
 */
export default function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-md bg-sunshine-soft/60",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.6s_ease-in-out_infinite]",
        "after:bg-linear-to-r after:from-transparent after:via-card/70 after:to-transparent",
        className,
      )}
      {...props}
    />
  );
}
