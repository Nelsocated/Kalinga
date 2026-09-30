import type { NotificationItem } from "@/src/app/site/notification/page";
import Avatar from "../ui/Avatar";
import StatusChip from "../ui/StatusChip";

type Props = {
  item: NotificationItem;
  onSelect?: () => void;
};

/** One application update: pet photo, title, short message, status and date. */
export default function NotifCard({ item, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-start gap-3 rounded-lg border border-line bg-card p-3 text-left transition-[box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift sm:p-4"
    >
      <Avatar src={item.petPhotoUrl} name={item.petName} size={48} className="rounded-md" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-start justify-between gap-2">
          <span className="font-semibold text-ink">{item.title}</span>
          <span className="shrink-0 text-xs text-muted">{item.date}</span>
        </span>
        <span className="line-clamp-2 text-sm text-ink-soft">{item.shortMessage}</span>
        <StatusChip status={item.status} className="mt-1 w-fit" />
      </span>
    </button>
  );
}
