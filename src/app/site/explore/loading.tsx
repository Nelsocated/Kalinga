import LoadingPage from "@/src/components/skeletons/LoadingPage";
import CardGridSkeleton from "@/src/components/skeletons/CardGridSkeleton";

export default function Loading() {
  return (
    <LoadingPage>
      <CardGridSkeleton />
    </LoadingPage>
  );
}
