import LoadingPage from "@/src/components/skeletons/LoadingPage";
import Skeleton from "@/src/components/ui/Skeleton";

export default function Loading() {
  return (
    <LoadingPage header={null}>
      <div className="mx-auto flex w-full max-w-3xl flex-col">
        <Skeleton className="aspect-[4/3] w-full rounded-xl sm:aspect-[16/10]" />
        <div className="flex flex-col gap-4 pt-6 sm:pt-8">
          <Skeleton className="h-10 w-4/5" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 sm:mt-8 sm:pt-8">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </LoadingPage>
  );
}
