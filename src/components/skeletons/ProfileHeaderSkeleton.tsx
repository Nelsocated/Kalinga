import Skeleton from "@/src/components/ui/Skeleton";

export default function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
      <Skeleton className="size-28 rounded-full" />
      <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
        <Skeleton className="h-7 w-56 max-w-full" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}
