import PageHeaderSkeleton from "./PageHeaderSkeleton";

/** WebTemplate's frame for loading.tsx files: same container, header, then the body. */
export default function LoadingPage({
  children,
  header = <PageHeaderSkeleton />,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:py-8"
    >
      <span className="sr-only">Loading</span>
      {header}
      {children}
    </div>
  );
}
