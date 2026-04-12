import type {
  PersonCard,
  MessageThread,
  Message,
} from "@/src/lib/types/messages";
import { ViewSkeleton } from "@/src/app/shelter/messages/loading";
import Image from "next/image";

type MessageWithSender = Message & {
  sender: PersonCard;
};

type Props = {
  selectedThreadId: string | null;
  selectedThread: MessageThread | null;
  messages: MessageWithSender[];
  loadingThread: boolean;
  onOpenReplyModal: () => void;
};

export default function ThreadView({
  selectedThreadId,
  selectedThread,
  messages,
  loadingThread,
  onOpenReplyModal,
}: Props) {
  if (!selectedThreadId) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500">
        Select a message thread
      </div>
    );
  }

  if (loadingThread) {
    return <ViewSkeleton />;
  }

  if (!selectedThread) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500">
        Thread not found.
      </div>
    );
  }

  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="flex h-full min-h-0 flex-col border-l bg-white">
      {/* Header */}
      <div className="shrink-0 border-b px-6 py-2">
        <h2 className="text-subtitle font-bold text-black">
          {selectedThread.subject}
        </h2>
        <p className="mt-1 text-description text-neutral-500">
          {selectedThread.thread_type === "adoption"
            ? "Adoption-related conversation"
            : "General conversation"}
        </p>
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {sortedMessages.length === 0 ? (
          <p className="px-6 py-3 text-sm text-neutral-500">No messages yet.</p>
        ) : (
          <div className="flex flex-col">
            {sortedMessages.map((message) => (
              <article key={message.id} className="border-b px-6 py-2">
                <div className="flex items-start gap-3">
                  <Avatar
                    name={message.sender.name}
                    image={message.sender.image}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-description font-semibold text-black">
                      {message.sender.name}
                    </p>
                    <p className="mt-0.5 text-small text-neutral-500">
                      {formatFullDate(message.created_at)}
                    </p>
                    <div className="mt-3">
                      <p className="whitespace-pre-wrap text-description leading-6 text-black">
                        {message.body}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Reply bar — naturally pinned at bottom via flex */}
      <div className="shrink-0 border-t bg-white px-5 py-2">
        <button
          type="button"
          onClick={onOpenReplyModal}
          className="rounded-[15px] border bg-white px-5 py-2 text-description font-semibold text-black transition hover:bg-primary"
        >
          Reply
        </button>
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
        width={500}
        height={500}
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

function formatFullDate(value: string) {
  const date = new Date(value);

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
