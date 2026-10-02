"use client";

import { useEffect, useRef } from "react";
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
  /** Phones hide the thread until it's opened; scroll to the latest message once it shows. */
  visible?: boolean;
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
  visible = true,
}: Props) {
  const endRef = useRef<HTMLLIElement>(null);

  // Open on the latest message, like a chat app
  useEffect(() => {
    if (visible && !loadingThread) endRef.current?.scrollIntoView({ block: "nearest" });
  }, [visible, loadingThread, messages]);

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
        <h2 className="text-lg font-semibold [overflow-wrap:anywhere] text-ink">{selectedThread.subject}</h2>
        <p className="text-sm text-muted">
          {selectedThread.thread_type === "adoption" ? "About an adoption application" : "General message"}
        </p>
      </header>

      <ol className="flex min-h-0 flex-1 flex-col gap-4 px-3 py-5 sm:px-6 md:overflow-y-auto">
        {ordered.length === 0 ? (
          <li className="text-sm text-muted">No messages yet.</li>
        ) : (
          ordered.map((message) => {
            const mine =
              senderSide === "user" ? !!message.sender_user_id : !!message.sender_shelter_id;
            return (
              <li key={message.id} className={cn("flex items-end gap-2", mine && "flex-row-reverse")}>
                <Avatar src={message.sender.image} name={message.sender.name} size={32} className="shrink-0" />
                <div className={cn("flex min-w-0 max-w-[85%] flex-col gap-1 sm:max-w-[80%]", mine && "items-end")}>
                  <div
                    className={cn(
                      "max-w-full rounded-lg px-4 py-3 text-base leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] text-ink",
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
        <li ref={endRef} aria-hidden="true" className="scroll-mb-40 md:scroll-mb-0" />
      </ol>

      {/* Phones: Reply stays reachable above the tab bar while reading a long thread */}
      <footer className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] shrink-0 rounded-b-lg border-t border-line bg-card px-4 py-3 sm:px-6 md:static">
        <Button variant="primary" onClick={onOpenReplyModal} icon={<ArrowBendUpLeft aria-hidden="true" />}>
          Reply
        </Button>
      </footer>
    </div>
  );
}
