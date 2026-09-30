import Link from "next/link";
import { CaretRight, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { ShelterApplicationItem } from "@/src/lib/services/adminService";
import Avatar from "../ui/Avatar";
import StatusChip from "../ui/StatusChip";

type Props = {
  item: ShelterApplicationItem;
};

function formatDate(dateString: string | null) {
  if (!dateString) return "Date unknown";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Date unknown";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** A shelter application in the admin queue; the whole row opens the review. */
export default function ShelterApplicationCard({ item }: Props) {
  return (
    <Link
      href={`/admin/application/${item.id}`}
      className="flex items-center gap-4 rounded-lg border border-line bg-card p-4 transition-[box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift"
    >
      <Avatar src={item.photo_url ?? item.logoUrl} name={item.shelterName} size={56} className="rounded-md" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate font-semibold text-ink">{item.shelterName}</p>
        <p className="flex min-w-0 items-center gap-1 text-sm text-muted">
          <MapPin size={14} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{item.location || "No address given"}</span>
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <StatusChip status={item.applicationStatus} />
          <span className="text-xs text-muted">
            Submitted {formatDate(item.applicationSubmittedAt ?? item.createdAt)}
          </span>
        </div>
      </div>
      <CaretRight size={18} aria-hidden="true" className="shrink-0 text-ink-soft" />
    </Link>
  );
}
