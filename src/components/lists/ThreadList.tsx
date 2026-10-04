"use client";

import { ChatCircle, MagnifyingGlass } from "@phosphor-icons/react";
import type { ThreadWithMeta } from "@/src/lib/types/messages";
import ListRowsSkeleton from "@/src/components/skeletons/ListRowsSkeleton";
import Avatar from "@/src/components/ui/Avatar";
import Button from "@/src/components/ui/Button";
import EmptyState from "@/src/components/ui/EmptyState";
import StatusChip, { type ChipStatus } from "@/src/components/ui/StatusChip";
import { matchesQuery } from "@/src/components/ui/SearchField";
import { cn } from "@/src/lib/cn";

type Props = {
  threads: ThreadWithMeta[];
  selectedThreadId: string | null;
  loading: boolean;
  onSelectThread: (threadId: string) => void;
  query: string;
  onClearQuery: () => void;
  withStatus?: boolean;
  /** Shown when the inbox is empty: what to do first. */
  empty: { description: string; action?: React.ReactNode };
};

/** "now", "5m", "2h", "Mon", then "Oct 1" (with the year once it isn't this year). */
export function formatRelativeTime(value: string, now = new Date()) {
  const date = new Date(value);
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}h`;
  if (minutes < 7 * 24 * 60) return date.toLocaleDateString(undefined, { weekday: "short" });
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
  });
}

/** The conversation list: one row per thread, unread ones in bold with a marker. */
export default function ThreadList({
  threads,
  selectedThreadId,
  loading,
  onSelectThread,
  query,
  onClearQuery,
  withStatus = false,
  empty,
}: Props) {
  if (loading) return <ListRowsSkeleton count={7} />;

  if (threads.length === 0) {
    return (
      <EmptyState
        icon={<ChatCircle aria-hidden="true" />}
        title="No messages yet"
        description={empty.description}
        action={empty.action}
      />
    );
  }

  const visible = threads.filter((t) =>
    matchesQuery(query, t.other_party?.name, t.subject, t.last_message_preview),
  );

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={<MagnifyingGlass aria-hidden="true" />}
        title={`No conversations match "${query.trim()}"`}
        action={
          <Button variant="secondary" onClick={onClearQuery}>
            Clear search
          </Button>
        }
      />
    );
  }

  return (
    <ul className="flex flex-col gap-1" aria-label="Conversations">
      {visible.map((thread) => {
        const active = selectedThreadId === thread.id;
        const unread = !!thread.unread && !active;
        const name = thread.other_party?.name || "Conversation";
        const status = withStatus ? (thread.adoption_status as ChipStatus | null) : null;

        return (
          <li key={thread.id}>
            <button
              type="button"
              onClick={() => onSelectThread(thread.id)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors",
                active ? "bg-sunshine-wash" : "hover:bg-sunshine-wash/60",
              )}
            >
              <Avatar src={thread.other_party?.image} name={name} size={44} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={cn("min-w-0 truncate text-ink", unread ? "font-bold" : "font-semibold")}>
                    {name}
                  </span>
                  <time
                    dateTime={thread.last_message_at}
                    className={cn("shrink-0 text-xs", unread ? "font-semibold text-ink" : "text-muted")}
                  >
                    {formatRelativeTime(thread.last_message_at)}
                  </time>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "line-clamp-1 min-w-0 flex-1 text-sm",
                      unread ? "font-medium text-ink" : "text-muted",
                    )}
                  >
                    {thread.last_message_preview || thread.subject}
                  </span>
                  {unread ? (
                    <span className="size-2.5 shrink-0 rounded-full bg-sunshine-deep">
                      <span className="sr-only">Unread</span>
                    </span>
                  ) : null}
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
