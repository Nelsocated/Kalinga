import LoadingPage from "@/src/components/skeletons/LoadingPage";
import Skeleton from "@/src/components/ui/Skeleton";

/** Mirrors the Create hub: the big Post a video tile, two rows beside it, then the pet strip. */
export default function Loading() {
  return (
    <LoadingPage>
      <div className="flex flex-col gap-10">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Skeleton className="min-h-56 rounded-xl" />
          <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-line">
            <Skeleton className="h-24 flex-1 rounded-none" />
            <Skeleton className="h-24 flex-1 rounded-none" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="aspect-4/5 w-32 shrink-0 rounded-lg sm:w-36" />
            ))}
          </div>
        </div>
      </div>
    </LoadingPage>
  );
}
