import FeedSkeleton from "@/src/components/skeletons/FeedSkeleton";

export default function Loading() {
  return (
    <div className="flex h-dvh items-center justify-center md:px-6">
      <FeedSkeleton />
    </div>
  );
}
