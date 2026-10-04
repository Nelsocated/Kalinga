import Skeleton from "@/src/components/ui/Skeleton";

/** An open conversation: who it's with, alternating message bubbles, then the reply box. */
export default function ThreadViewSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col" aria-hidden="true">
      <div className="flex items-center gap-3 border-b border-line p-3 sm:px-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56 max-w-full" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {[false, true, false, true].map((mine, i) => (
          <Skeleton
            key={i}
            className={mine ? "h-14 w-3/5 self-end rounded-lg" : "h-16 w-2/3 self-start rounded-lg"}
          />
        ))}
      </div>
      <div className="flex items-end gap-2 border-t border-line p-3 sm:px-4">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="size-12 rounded-full" />
      </div>
    </div>
  );
}
