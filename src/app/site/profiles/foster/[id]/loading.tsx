import LoadingPage from "@/src/components/skeletons/LoadingPage";
import Skeleton from "@/src/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingPage header={null}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <Skeleton className="aspect-[4/5] w-full rounded-lg" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-48" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </LoadingPage>
  );
}
