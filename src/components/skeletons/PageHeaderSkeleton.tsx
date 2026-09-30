import Skeleton from "@/src/components/ui/Skeleton";

/** Back button + title, as WebTemplate draws them. */
export default function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-11 rounded-full" />
      <Skeleton className="h-8 w-48" />
    </div>
  );
}
