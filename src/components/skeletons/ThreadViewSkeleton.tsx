import Skeleton from "@/src/components/ui/Skeleton";

/** An open conversation: subject, then alternating message bubbles. */
export default function ThreadViewSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4" aria-hidden="true">
      <div className="flex flex-col gap-2 border-b border-line pb-4">
        <Skeleton className="h-6 w-52 max-w-full" />
        <Skeleton className="h-4 w-36" />
      </div>
      {[false, true, false, true].map((mine, i) => (
        <Skeleton
          key={i}
          className={
            mine
              ? "h-16 w-3/5 self-end rounded-lg"
              : "h-20 w-2/3 self-start rounded-lg"
          }
        />
      ))}
    </div>
  );
}
