"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NotePencil } from "@phosphor-icons/react";
import WebTemplate from "./WebTemplate";
import ThreadList from "../lists/ThreadList";
import ThreadView from "../views/ThreadView";
import ComposeView from "../views/ComposeView";
import Button, { LinkButton } from "../ui/Button";
import SearchField from "../ui/SearchField";
import { markThreadReadAction } from "@/src/app/actions/social";
import { cn } from "@/src/lib/cn";
import type {
  PersonCard,
  Message,
  ThreadWithMeta,
  ThreadResponse,
  ComposeRecipient,
} from "@/src/lib/types/messages";

type MessageWithSender = Message & { sender: PersonCard };

type Props = {
  userId: string;
  senderSide: "user" | "shelter";
  initialThreads: ThreadWithMeta[];
  enrichThread: (thread: ThreadWithMeta) => ThreadWithMeta;
  fetchThreads: () => Promise<ThreadWithMeta[]>;
  fetchThread: (threadId: string) => Promise<ThreadResponse>;
  buildMessages: (data: ThreadResponse) => MessageWithSender[];
  composeRecipients: ComposeRecipient[];
};

/** Background refreshes (after sending) keep what's on screen instead of flashing skeletons. */
type LoadOptions = { silent?: boolean };

/**
 * One inbox of conversations, shared by users and shelters.
 * Phones: the list, then the open thread as its own screen. From md: side by side.
 */
export default function MessagesLayout({
  userId,
  senderSide,
  initialThreads,
  enrichThread,
  fetchThreads,
  fetchThread,
  buildMessages,
  composeRecipients,
}: Props) {
  const [composeOpen, setComposeOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [query, setQuery] = useState("");
  const [threads, setThreads] = useState<ThreadWithMeta[]>(() => initialThreads.map(enrichThread));
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreads[0]?.id ?? null);
  const [selectedThread, setSelectedThread] = useState<ThreadWithMeta | null>(
    initialThreads[0] ? enrichThread(initialThreads[0]) : null,
  );
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const threadsRef = useRef<ThreadWithMeta[]>(threads);
  useEffect(() => {
    threadsRef.current = threads;
  }, [threads]);

  const loadThreads = useCallback(
    async ({ silent = false }: LoadOptions = {}): Promise<ThreadWithMeta[]> => {
      try {
        if (!silent) setLoadingThreads(true);
        setError(null);
        const next = (await fetchThreads()).map(enrichThread);
        setThreads(next);
        return next;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't load your messages.");
        return [];
      } finally {
        setLoadingThreads(false);
      }
    },
    [fetchThreads, enrichThread],
  );

  const loadThread = useCallback(
    async (threadId: string, { silent = false }: LoadOptions = {}) => {
      try {
        if (!silent) setLoadingThread(true);
        setError(null);
        const data = await fetchThread(threadId);
        const existing = threadsRef.current.find((t) => t.id === threadId);
        const merged: ThreadWithMeta = {
          ...data.thread,
          other_party: data.thread.other_party ?? existing?.other_party ?? null,
        };
        const loaded = enrichThread(merged);
        setSelectedThread(loaded);
        setMessages(buildMessages({ ...data, thread: merged }));
        setThreads((prev) =>
          prev.map((t) =>
            t.id !== loaded.id
              ? t
              : enrichThread({
                  ...t,
                  ...loaded,
                  unread: false,
                  last_message_preview: loaded.last_message_preview?.trim() || t.last_message_preview || null,
                }),
          ),
        );

        // Opening a thread reads it; a failure only means the marker comes back on the next load
        if (existing?.unread) void markThreadReadAction(threadId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't open this conversation.");
      } finally {
        setLoadingThread(false);
      }
    },
    [fetchThread, enrichThread, buildMessages],
  );

  useEffect(() => {
    if (selectedThreadId) void loadThread(selectedThreadId);
  }, [selectedThreadId, loadThread]);

  /** After a reply: refresh the open thread and move it to the top of the list, quietly. */
  async function handleReplySent() {
    if (!selectedThreadId) return;
    await Promise.all([loadThread(selectedThreadId, { silent: true }), loadThreads({ silent: true })]);
  }

  /** After a new message: open its thread. */
  async function handleCreated(threadId: string) {
    setComposeOpen(false);
    setQuery("");
    const next = await loadThreads({ silent: true });
    const nextId = next.find((t) => t.id === threadId)?.id ?? next[0]?.id ?? null;
    // Same thread already open: the selection effect won't fire, so reload it here
    if (nextId && nextId === selectedThreadId) await loadThread(nextId, { silent: true });
    setSelectedThreadId(nextId);
    if (nextId) setShowDetail(true);
  }

  const empty =
    senderSide === "user"
      ? {
          description: "Message a shelter you've liked to ask about a pet.",
          action: (
            <LinkButton href="/site/shelters" variant="secondary">
              Browse shelters
            </LinkButton>
          ),
        }
      : { description: "When an adopter writes to you, the conversation shows up here." };

  return (
    <>
      <WebTemplate
        header="Messages"
        actions={
          <Button variant="primary" onClick={() => setComposeOpen(true)} icon={<NotePencil aria-hidden="true" />}>
            <span className="hidden sm:inline">New message</span>
            <span className="sm:hidden">New</span>
          </Button>
        }
        main={
          <div className="flex flex-col gap-4">
            {error ? (
              <p role="alert" className="rounded-md bg-reject/10 px-4 py-3 text-sm text-reject-text">
                {error}
              </p>
            ) : null}

            {/* minmax(0,1fr) on phones too, so a long word or link can't stretch the column past the screen */}
            <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:h-[calc(100dvh-11rem)] md:grid-cols-[320px_minmax(0,1fr)]">
              <div className={cn("flex min-h-0 min-w-0 flex-col gap-3", showDetail && "hidden md:flex")}>
                {threads.length ? (
                  <SearchField
                    value={query}
                    onChange={setQuery}
                    label="Search conversations"
                    placeholder="Search by name or message"
                    className="sm:max-w-none"
                  />
                ) : null}
                <div className="min-h-0 flex-1 md:overflow-y-auto">
                  <ThreadList
                    threads={threads}
                    selectedThreadId={selectedThreadId}
                    loading={loadingThreads}
                    onSelectThread={(id) => {
                      setSelectedThreadId(id);
                      setShowDetail(true);
                    }}
                    query={query}
                    onClearQuery={() => setQuery("")}
                    withStatus={senderSide === "shelter"}
                    empty={empty}
                  />
                </div>
              </div>

              <div
                className={cn(
                  // Phones: the thread flows with the page (no inner scroll box to clip it); from md it scrolls inside the pane
                  "min-w-0 rounded-lg border border-line bg-card md:min-h-0 md:overflow-hidden",
                  !showDetail && "hidden md:block",
                )}
              >
                <ThreadView
                  selectedThreadId={selectedThreadId}
                  selectedThread={selectedThread}
                  messages={messages}
                  loadingThread={loadingThread}
                  senderSide={senderSide}
                  visible={showDetail}
                  onBack={() => setShowDetail(false)}
                  onSent={handleReplySent}
                />
              </div>
            </div>
          </div>
        }
      />

      <ComposeView
        isOpen={composeOpen}
        userId={userId}
        senderSide={senderSide}
        mode="new"
        recipients={composeRecipients}
        onClose={() => setComposeOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
