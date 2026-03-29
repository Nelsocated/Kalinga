import type { SentMessageItem } from "@/lib/types/messages";
import { formatShortDate } from "./ThreadList";

type Props = {
  items: SentMessageItem[];
  loading: boolean;
  onOpenMessage: (item: SentMessageItem) => void;
};

export default function SentMessagesList({
  items,
  loading,
  onOpenMessage,
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="w-full border-b-2 px-5 text-center text-subtitle font-semibold text-black">
        Sent Messages
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-stable">
        {loading ? (
          <p className="p-3 text-small text-neutral-500">Loading...</p>
        ) : (
          <div className="space-y-2 p-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenMessage(item)}
                className="w-full rounded-[15px] border p-4 py-2 text-left hover:bg-neutral-50"
              >
                <div className="flex items-center justify-between text-sm font-bold">
                  <div className="flex items-center truncate">
                    {item.receiver.name}
                  </div>
                  <div className="text-small font-normal text-neutral-500">
                    {formatShortDate(item.created_at)}
                  </div>
                </div>

                <p className="truncate text-description font-semibold text-neutral-600">
                  {item.subject || "(No subject)"}
                </p>

                <p className="mt-2 line-clamp-2 truncate text-small text-black">
                  {item.body}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
