import Image from "next/image";
import type { PersonCard, MessageThread } from "@/lib/types/messages";

type ThreadWithMeta = MessageThread & {
  adoption_status: string | null;
  last_message_preview: string | null;
  unread_count: number;
  other_party: PersonCard | null;
};

type Props = {
  threads: ThreadWithMeta[];
  selectedThreadId: string | null;
  loading: boolean;
  onSelectThread: (threadId: string) => void;
};

export default function ThreadList({
  threads,
  selectedThreadId,
  loading,
  onSelectThread,
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="w-full border-b-2 px-5 py-2 text-center text-2xl font-semibold text-black">
        Messages Received
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-stable">
        {loading ? (
          <div className="p-4 text-sm text-neutral-500">
            Loading messages...
          </div>
        ) : threads.length === 0 ? (
          <div className="p-4 text-sm text-neutral-500">No messages yet.</div>
        ) : (
          <div className="space-y-2 p-3">
            {threads.map((thread) => {
              const isActive = selectedThreadId === thread.id;
              const otherPartyName = thread.other_party?.name || "Shelter";
              const otherPartyImage = thread.other_party?.image || null;

              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => onSelectThread(thread.id)}
                  className={`w-full rounded-[15px] border px-4 py-2 text-left transition ${
                    isActive
                      ? "border bg-background"
                      : "border-neutral-200 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={otherPartyName} image={otherPartyImage} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-black">
                            {otherPartyName}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {thread.subject}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {thread.unread_count > 0 ? (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-black">
                              {thread.unread_count}
                            </span>
                          ) : null}
                          <span className="text-[10px] text-neutral-500">
                            {formatShortDate(thread.last_message_at)}
                          </span>
                        </div>
                      </div>

                      <p className="mt-2 line-clamp-2 text-xs text-neutral-600">
                        {thread.last_message_preview || "No preview available"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={30}
        height={30}
        className="h-10 w-10 rounded-full border object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-neutral-100 text-xs font-semibold text-neutral-600">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

export function formatShortDate(value: string) {
  const date = new Date(value);

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
