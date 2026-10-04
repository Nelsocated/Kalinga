"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ChatCircle } from "@phosphor-icons/react";
import type { PersonCard, ThreadWithMeta, Message } from "@/src/lib/types/messages";
import ThreadViewSkeleton from "@/src/components/skeletons/ThreadViewSkeleton";
import Avatar from "@/src/components/ui/Avatar";
import { buttonStyles } from "@/src/components/ui/Button";
import EmptyState from "@/src/components/ui/EmptyState";
import StatusChip, { type ChipStatus } from "@/src/components/ui/StatusChip";
import ThreadComposer from "./ThreadComposer";
import { cn } from "@/src/lib/cn";

type MessageWithSender = Message & { sender: PersonCard };

type Props = {
  selectedThreadId: string | null;
  selectedThread: ThreadWithMeta | null;
  messages: MessageWithSender[];
  loadingThread: boolean;
  /** Which side the viewer writes as, to tell their own messages apart. */
  senderSide: "user" | "shelter";
  /** Phones hide the thread until it's opened; scroll to the latest message once it shows. */
  visible?: boolean;
  /** Phones: back to the conversation list. */
  onBack: () => void;
  onSent: () => void;
};

/** Messages from one sender within this window share a bubble group: one avatar, one time. */
const GROUP_WINDOW_MS = 10 * 60 * 1000;

function dayKey(value: string) {
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatDay(value: string, now = new Date()) {
  const date = new Date(value);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (dayKey(value) === dayKey(now.toISOString())) return "Today";
  if (dayKey(value) === dayKey(yesterday.toISOString())) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(date.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
  });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

/** One conversation as a chat: who it's with, the messages grouped by sender and day, a reply box. */
export default function ThreadView({
  selectedThreadId,
  selectedThread,
  messages,
  loadingThread,
  senderSide,
  visible = true,
  onBack,
  onSent,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Open on the latest message: inside the pane from md, on the page on phones
  useEffect(() => {
    if (loadingThread) return;
    const pane = scrollRef.current;
    if (pane) pane.scrollTop = pane.scrollHeight;
    if (visible) endRef.current?.scrollIntoView({ block: "nearest" });
  }, [visible, loadingThread, messages]);

  if (!selectedThreadId) {
    return (
      <EmptyState
        className="h-full"
        icon={<ChatCircle aria-hidden="true" />}
        title="Pick a conversation"
        description="Choose one from the list to read it here."
      />
    );
  }

  if (loadingThread) return <ThreadViewSkeleton />;

  if (!selectedThread) {
    return <EmptyState className="h-full" icon={<ChatCircle aria-hidden="true" />} title="This conversation isn't available" />;
  }

  const other = selectedThread.other_party;
  const otherName = other?.name || "Conversation";
  const profileHref = other?.id
    ? senderSide === "user"
      ? `/site/profiles/shelter/${other.id}`
      : `/site/profiles/user/${other.id}`
    : null;
  const status = selectedThread.thread_type === "adoption" ? (selectedThread.adoption_status as ChipStatus | null) : null;

  const ordered = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const identity = (
    <>
      <Avatar src={other?.image} name={otherName} size={40} />
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-semibold text-ink">{otherName}</span>
        <span className="truncate text-sm text-muted">{selectedThread.subject}</span>
      </span>
    </>
  );
  const isMine = (m: MessageWithSender) =>
    senderSide === "user" ? !!m.sender_user_id : !!m.sender_shelter_id;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Phones: stays on top while the thread scrolls with the page */}
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 rounded-t-lg border-b border-line bg-card px-2 py-2 sm:px-4 md:static md:py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="All messages"
          className={buttonStyles({ variant: "ghost", size: "icon", className: "md:hidden" })}
        >
          <ArrowLeft aria-hidden="true" />
        </button>
        {profileHref ? (
          <Link
            href={profileHref}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-full py-1 pr-3 transition-colors hover:bg-sunshine-wash"
          >
            {identity}
          </Link>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">{identity}</div>
        )}
        {status ? <StatusChip status={status} className="shrink-0" /> : null}
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 px-3 py-4 sm:px-5 md:overflow-y-auto">
        {ordered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No messages yet. Say hello below.</p>
        ) : (
          <ol className="flex flex-col">
            {ordered.map((message, i) => {
              const prev = ordered[i - 1];
              const next = ordered[i + 1];
              const mine = isMine(message);
              const newDay = !prev || dayKey(prev.created_at) !== dayKey(message.created_at);
              const sameAsNext =
                !!next &&
                isMine(next) === mine &&
                dayKey(next.created_at) === dayKey(message.created_at) &&
                new Date(next.created_at).getTime() - new Date(message.created_at).getTime() < GROUP_WINDOW_MS;
              const sameAsPrev =
                !newDay &&
                !!prev &&
                isMine(prev) === mine &&
                new Date(message.created_at).getTime() - new Date(prev.created_at).getTime() < GROUP_WINDOW_MS;
              const lastInGroup = !sameAsNext;

              return (
                <Fragment key={message.id}>
                  {newDay ? (
                    <li className="flex justify-center py-3">
                      <span className="rounded-full bg-ground px-3 py-1 text-xs font-medium text-ink-soft">
                        {formatDay(message.created_at)}
                      </span>
                    </li>
                  ) : null}
                  <li className={cn("flex items-end gap-2", mine && "flex-row-reverse", sameAsPrev ? "mt-1" : "mt-3")}>
                    {/* One avatar per group, at its last bubble; a spacer keeps the others aligned */}
                    {mine ? null : lastInGroup ? (
                      <Avatar src={message.sender.image} name={message.sender.name} size={32} />
                    ) : (
                      <span aria-hidden="true" className="w-8 shrink-0" />
                    )}
                    <div className={cn("flex min-w-0 max-w-[85%] flex-col gap-1 sm:max-w-[75%]", mine && "items-end")}>
                      <p
                        title={new Date(message.created_at).toLocaleString()}
                        className={cn(
                          "max-w-full rounded-lg px-4 py-2.5 text-base leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] text-ink",
                          mine ? "bg-sunshine-soft" : "border border-line bg-card",
                        )}
                      >
                        <span className="sr-only">{mine ? "You" : message.sender.name}: </span>
                        {message.body}
                      </p>
                      {lastInGroup ? (
                        <time dateTime={message.created_at} className="px-1 text-xs text-muted">
                          {formatTime(message.created_at)}
                        </time>
                      ) : null}
                    </div>
                  </li>
                </Fragment>
              );
            })}
          </ol>
        )}
        <div ref={endRef} aria-hidden="true" className="scroll-mb-44 md:scroll-mb-0" />
      </div>

      {/* Phones: the reply box stays above the tab bar */}
      <ThreadComposer
        key={selectedThread.id}
        threadId={selectedThread.id}
        recipientName={otherName}
        onSent={onSent}
        className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] rounded-b-lg md:static"
      />
    </div>
  );
}
