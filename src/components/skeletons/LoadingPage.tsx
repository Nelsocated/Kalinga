import PageHeaderSkeleton from "./PageHeaderSkeleton";
import PageFrame from "../template/PageFrame";

/** WebTemplate's frame for loading.tsx files: same panel, header, then the body. */
export default function LoadingPage({
  children,
  header = <PageHeaderSkeleton />,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
}) {
  return (
    <PageFrame role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      {header}
      {children}
    </PageFrame>
  );
}
