import LoadingPage from "@/src/components/skeletons/LoadingPage";
import Skeleton from "@/src/components/ui/Skeleton";
import ListRowsSkeleton from "@/src/components/skeletons/ListRowsSkeleton";

export default function Loading() {
  return (
    <LoadingPage>
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>
      <ListRowsSkeleton />
    </LoadingPage>
  );
}
