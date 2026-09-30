import { PaperPlaneTilt } from "@phosphor-icons/react";
import type { SentMessageItem } from "@/src/lib/types/messages";
import { formatShortDate } from "./ThreadList";
import ListRowsSkeleton from "@/src/components/skeletons/ListRowsSkeleton";
import EmptyState from "@/src/components/ui/EmptyState";

type Props = {
  items: SentMessageItem[];
  loading: boolean;
  onOpenMessage: (item: SentMessageItem) => void;
};

export default function SentMessagesList({ items, loading, onOpenMessage }: Props) {
  if (loading) return <ListRowsSkeleton count={7} />;

  if (items.length === 0) {
    return <EmptyState icon={<PaperPlaneTilt aria-hidden="true" />} title="Nothing sent yet" />;
  }

  return (
    <ul className="flex flex-col gap-1.5" aria-label="Sent messages">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onOpenMessage(item)}
            className="flex w-full flex-col gap-0.5 rounded-lg px-3 py-3 text-left transition-colors hover:bg-sunshine-wash/60"
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate font-semibold text-ink">To {item.receiver.name}</span>
              <span className="shrink-0 text-xs text-muted">{formatShortDate(item.created_at)}</span>
            </span>
            <span className="truncate text-sm text-ink">{item.subject || "No subject"}</span>
            <span className="line-clamp-1 text-sm text-muted">{item.body}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
