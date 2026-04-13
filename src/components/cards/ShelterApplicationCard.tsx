import Link from "next/link";
import type { ShelterApplicationItem } from "@/src/lib/services/adminService";
import Image from "next/image";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";

type Props = {
  item: ShelterApplicationItem;
};

function formatTimeAgo(dateString: string | null) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export default function ShelterApplicationCard({ item }: Props) {
  return (
    <article className="rounded-[15px] border-2 bg-outerbg p-2">
      <div className="flex items-center gap-3">
        <div className="w-25 border rounded-[15px]">
          <Image
            src={item.photo_url ?? DEFAULT_AVATAR_URL}
            alt={`${item.shelterName} photo`}
            width={500}
            height={500}
          />
        </div>

        <div className="min-w-0 flex-1 items-center">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-1 text-subtitle font-bold text-black md:text-subtitle">
              {item.shelterName}
            </h2>

            <span className="shrink-0 text-sm text-neutral-500">
              {formatTimeAgo(item.applicationSubmittedAt ?? item.createdAt)}
            </span>
          </div>

          <Link
            href={`/admin/application/${item.id}`}
            className="mt-2 flex h-8.5 w-full items-center justify-center rounded-[15px] border bg-innerbg text-sm font-medium text-black transition"
          >
            Review Application
          </Link>
        </div>
      </div>
    </article>
  );
}
