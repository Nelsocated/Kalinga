"use client";

import { ChatCircle } from "@phosphor-icons/react";
import type { ThreadWithMeta } from "@/src/lib/types/messages";
import ListRowsSkeleton from "@/src/components/skeletons/ListRowsSkeleton";
import Avatar from "@/src/components/ui/Avatar";
import EmptyState from "@/src/components/ui/EmptyState";
import StatusChip, { type ChipStatus } from "@/src/components/ui/StatusChip";
import { cn } from "@/src/lib/cn";

type Props = {
  threads: ThreadWithMeta[];
  selectedThreadId: string | null;
  loading: boolean;
  onSelectThread: (threadId: string) => void;
  withStatus?: boolean;
  emptyHint?: string;
};

export function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ThreadList({
  threads,
  selectedThreadId,
  loading,
  onSelectThread,
  withStatus = false,
  emptyHint,
}: Props) {
  if (loading) return <ListRowsSkeleton count={7} />;

  if (threads.length === 0) {
    return (
      <EmptyState
        icon={<ChatCircle aria-hidden="true" />}
        title="No messages yet"
        description={emptyHint}
      />
    );
  }

  return (
    <ul className="flex flex-col gap-1.5" aria-label="Conversations">
      {threads.map((thread) => {
        const active = selectedThreadId === thread.id;
        const name = thread.other_party?.name || "Conversation";
        const status = withStatus ? (thread.adoption_status as ChipStatus | null) : null;

        return (
          <li key={thread.id}>
            <button
              type="button"
              onClick={() => onSelectThread(thread.id)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors",
                active ? "bg-sunshine-wash" : "hover:bg-sunshine-wash/60",
              )}
            >
              <Avatar src={thread.other_party?.image} name={name} size={44} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate font-semibold text-ink">{name}</span>
                  <span className="shrink-0 text-xs text-muted">{formatShortDate(thread.last_message_at)}</span>
                </span>
                <span className="truncate text-sm text-ink">{thread.subject}</span>
                <span className="line-clamp-1 text-sm text-muted">
                  {thread.last_message_preview || "No messages yet"}
                </span>
                {status ? <StatusChip status={status} className="mt-1 w-fit" /> : null}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
