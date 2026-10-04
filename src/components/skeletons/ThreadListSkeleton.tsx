import Skeleton from "@/src/components/ui/Skeleton";
import ListRowsSkeleton from "./ListRowsSkeleton";

/** Search pill and thread list; the open thread pane joins it from md. */
export default function ThreadListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-[320px_1fr]">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-12 rounded-full" />
        <ListRowsSkeleton count={7} />
      </div>
      <Skeleton className="hidden h-[60dvh] rounded-lg md:block" />
    </div>
  );
}
