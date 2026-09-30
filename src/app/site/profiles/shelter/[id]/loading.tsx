import LoadingPage from "@/src/components/skeletons/LoadingPage";
import ProfileHeaderSkeleton from "@/src/components/skeletons/ProfileHeaderSkeleton";
import CardGridSkeleton from "@/src/components/skeletons/CardGridSkeleton";

export default function Loading() {
  return (
    <LoadingPage>
      <ProfileHeaderSkeleton />
      <CardGridSkeleton count={4} />
    </LoadingPage>
  );
}
