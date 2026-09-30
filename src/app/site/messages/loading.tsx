import LoadingPage from "@/src/components/skeletons/LoadingPage";
import ThreadListSkeleton from "@/src/components/skeletons/ThreadListSkeleton";

export default function Loading() {
  return (
    <LoadingPage>
      <ThreadListSkeleton />
    </LoadingPage>
  );
}
