import LoadingPage from "@/src/components/skeletons/LoadingPage";
import ProfileHeaderSkeleton from "@/src/components/skeletons/ProfileHeaderSkeleton";
import ListRowsSkeleton from "@/src/components/skeletons/ListRowsSkeleton";

export default function Loading() {
  return (
    <LoadingPage>
      <ProfileHeaderSkeleton />
      <ListRowsSkeleton count={4} avatar={false} />
    </LoadingPage>
  );
}
