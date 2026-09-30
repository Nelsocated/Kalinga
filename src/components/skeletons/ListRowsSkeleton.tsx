import Skeleton from "@/src/components/ui/Skeleton";

export default function ListRowsSkeleton({
  count = 6,
  avatar = true,
}: {
  count?: number;
  avatar?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex items-center gap-3 rounded-lg border border-line bg-card p-3">
          {avatar ? <Skeleton className="size-12 shrink-0 rounded-full" /> : null}
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </li>
      ))}
    </ul>
  );
}
