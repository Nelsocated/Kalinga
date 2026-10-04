import Skeleton from "@/src/components/ui/Skeleton";

/** Matches ProfileHero: avatar, name and subtitle, stacked on phones and in a row from md. */
export default function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:gap-5">
      <Skeleton className="size-24 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}
