import LoadingPage from "@/src/components/skeletons/LoadingPage";
import ListRowsSkeleton from "@/src/components/skeletons/ListRowsSkeleton";

export default function Loading() {
  return (
    <LoadingPage>
      <ListRowsSkeleton count={8} />
    </LoadingPage>
  );
}
