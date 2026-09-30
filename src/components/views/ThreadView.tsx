import { ArrowBendUpLeft, ChatCircle } from "@phosphor-icons/react";
import type { PersonCard, MessageThread, Message } from "@/src/lib/types/messages";
import ThreadViewSkeleton from "@/src/components/skeletons/ThreadViewSkeleton";
import Avatar from "@/src/components/ui/Avatar";
import Button from "@/src/components/ui/Button";
import EmptyState from "@/src/components/ui/EmptyState";
import { cn } from "@/src/lib/cn";

type MessageWithSender = Message & { sender: PersonCard };

type Props = {
  selectedThreadId: string | null;
  selectedThread: MessageThread | null;
  messages: MessageWithSender[];
  loadingThread: boolean;
  onOpenReplyModal: () => void;
  /** Which side the viewer writes as, to tell their own messages apart. */
  senderSide: "user" | "shelter";
};

function formatFullDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** One conversation: subject, then messages oldest first as bubbles, reply at the bottom. */
export default function ThreadView({
  selectedThreadId,
  selectedThread,
  messages,
  loadingThread,
  onOpenReplyModal,
  senderSide,
}: Props) {
  if (!selectedThreadId) {
    return (
      <EmptyState
        className="h-full"
        icon={<ChatCircle aria-hidden="true" />}
        title="Pick a conversation"
        description="Choose a message on the left to read it here."
      />
    );
  }

  if (loadingThread) return <ThreadViewSkeleton />;

  if (!selectedThread) {
    return <EmptyState className="h-full" icon={<ChatCircle aria-hidden="true" />} title="This conversation isn't available" />;
  }

  const ordered = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 border-b border-line px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-ink">{selectedThread.subject}</h2>
        <p className="text-sm text-muted">
          {selectedThread.thread_type === "adoption" ? "About an adoption application" : "General message"}
        </p>
      </header>

      <ol className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6">
        {ordered.length === 0 ? (
          <li className="text-sm text-muted">No messages yet.</li>
        ) : (
          ordered.map((message) => {
            const mine =
              senderSide === "user" ? !!message.sender_user_id : !!message.sender_shelter_id;
            return (
              <li key={message.id} className={cn("flex items-end gap-2", mine && "flex-row-reverse")}>
                <Avatar src={message.sender.image} name={message.sender.name} size={32} />
                <div className={cn("flex max-w-[80%] flex-col gap-1", mine && "items-end")}>
                  <div
                    className={cn(
                      "rounded-lg px-4 py-3 text-base leading-relaxed whitespace-pre-wrap text-ink",
                      mine ? "bg-sunshine-soft" : "border border-line bg-card",
                    )}
                  >
                    {message.body}
                  </div>
                  <p className="text-xs text-muted">
                    <span className="sr-only">{mine ? "You" : message.sender.name}, </span>
                    {formatFullDate(message.created_at)}
                  </p>
                </div>
              </li>
            );
          })
        )}
      </ol>

      <footer className="shrink-0 border-t border-line px-4 py-3 sm:px-6">
        <Button variant="primary" onClick={onOpenReplyModal} icon={<ArrowBendUpLeft aria-hidden="true" />}>
          Reply
        </Button>
      </footer>
    </div>
  );
}
