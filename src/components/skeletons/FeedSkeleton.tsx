import Skeleton from "@/src/components/ui/Skeleton";

/** Same frame as the feed: full screen on phones, a centered 9:16 card from md. */
export default function FeedSkeleton() {
  return (
    <div className="mx-auto h-dvh w-full md:h-[calc(100dvh-4rem)] md:w-[min(56dvh,480px)]">
      <Skeleton className="h-full w-full rounded-none bg-sunshine-soft md:rounded-xl" />
    </div>
  );
}
