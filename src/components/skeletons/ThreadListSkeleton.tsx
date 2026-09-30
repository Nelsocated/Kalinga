import Skeleton from "@/src/components/ui/Skeleton";
import ListRowsSkeleton from "./ListRowsSkeleton";

/** Thread list; the open thread pane joins it from md. */
export default function ThreadListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-[320px_1fr]">
      <ListRowsSkeleton count={7} />
      <Skeleton className="hidden h-[60dvh] rounded-lg md:block" />
    </div>
  );
}
