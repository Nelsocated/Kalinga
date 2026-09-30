"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, NotePencil } from "@phosphor-icons/react";
import WebTemplate from "./WebTemplate";
import MessagesTabs, { type MessagesView } from "../tabs/MessagesTabs";
import ThreadList from "../lists/ThreadList";
import ThreadView from "../views/ThreadView";
import ComposeView from "../views/ComposeView";
import SentMessagesList from "../lists/SentMessagesList";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { cn } from "@/src/lib/cn";
import type {
  PersonCard,
  SentMessageItem,
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
  fetchSentMessages: () => Promise<SentMessageItem[]>;
  buildMessages: (data: ThreadResponse) => MessageWithSender[];
  composeRecipients: ComposeRecipient[];
};

/**
 * Inbox shared by users and shelters.
 * Phones: the list, then the open thread as its own screen. From md: side by side.
 */
export default function MessagesLayout({
  userId,
  senderSide,
  initialThreads,
  enrichThread,
  fetchThreads,
  fetchThread,
  fetchSentMessages,
  buildMessages,
  composeRecipients,
}: Props) {
  const [mode, setMode] = useState<MessagesView>("inbox");
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [threads, setThreads] = useState<ThreadWithMeta[]>(() => initialThreads.map(enrichThread));
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreads[0]?.id ?? null);
  const [selectedThread, setSelectedThread] = useState<ThreadWithMeta | null>(
    initialThreads[0] ? enrichThread(initialThreads[0]) : null,
  );
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [sentMessages, setSentMessages] = useState<SentMessageItem[]>([]);
  const [openedMessage, setOpenedMessage] = useState<SentMessageItem | null>(null);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [loadingSent, setLoadingSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const threadsRef = useRef<ThreadWithMeta[]>(threads);
  useEffect(() => {
    threadsRef.current = threads;
  }, [threads]);

  const loadThreads = useCallback(async (): Promise<ThreadWithMeta[]> => {
    try {
      setLoadingThreads(true);
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
  }, [fetchThreads, enrichThread]);

  const loadThread = useCallback(
    async (threadId: string) => {
      try {
        setLoadingThread(true);
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
                  last_message_preview: loaded.last_message_preview?.trim() || t.last_message_preview || null,
                }),
          ),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't open this conversation.");
      } finally {
        setLoadingThread(false);
      }
    },
    [fetchThread, enrichThread, buildMessages],
  );

  const loadSentMessages = useCallback(async () => {
    try {
      setLoadingSent(true);
      setError(null);
      setSentMessages(await fetchSentMessages());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load sent messages.");
    } finally {
      setLoadingSent(false);
    }
  }, [fetchSentMessages]);

  useEffect(() => {
    if (mode === "inbox" && selectedThreadId) void loadThread(selectedThreadId);
  }, [mode, selectedThreadId, loadThread]);

  useEffect(() => {
    if (mode === "sent") void loadSentMessages();
  }, [mode, loadSentMessages]);

  async function handleRefreshAfterSend(threadId: string) {
    setComposeOpen(false);
    setReplyOpen(false);
    setMode("inbox");
    const next = await loadThreads();
    const nextId = next.find((t) => t.id === threadId)?.id ?? next[0]?.id ?? null;
    setSelectedThreadId(nextId);
    if (nextId) {
      await loadThread(nextId);
      setShowDetail(true);
    } else {
      setSelectedThread(null);
      setMessages([]);
    }
  }

  const lockedRecipient = selectedThread?.other_party
    ? {
        id: selectedThread.other_party.id,
        name: selectedThread.other_party.name,
        image: selectedThread.other_party.image ?? null,
        subtitle: selectedThread.other_party.subtitle ?? null,
        type: senderSide === "user" ? ("shelter" as const) : ("user" as const),
      }
    : null;

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

            <div className="grid gap-4 md:h-[calc(100dvh-11rem)] md:grid-cols-[320px_minmax(0,1fr)]">
              <div className={cn("flex min-h-0 flex-col gap-3", showDetail && "hidden md:flex")}>
                <MessagesTabs mode={mode} setMode={setMode} />
                <div className="min-h-0 flex-1 md:overflow-y-auto">
                  {mode === "inbox" ? (
                    <ThreadList
                      threads={threads}
                      selectedThreadId={selectedThreadId}
                      loading={loadingThreads}
                      onSelectThread={(id) => {
                        setSelectedThreadId(id);
                        setShowDetail(true);
                      }}
                      withStatus={senderSide === "shelter"}
                      emptyHint={senderSide === "user" ? "Message a shelter you've liked." : undefined}
                    />
                  ) : (
                    <SentMessagesList items={sentMessages} loading={loadingSent} onOpenMessage={setOpenedMessage} />
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "min-h-[60dvh] overflow-hidden rounded-lg border border-line bg-card md:min-h-0",
                  mode === "sent" && "hidden md:block",
                  !showDetail && "hidden md:block",
                )}
              >
                <div className="border-b border-line px-2 py-2 md:hidden">
                  <Button variant="ghost" size="sm" onClick={() => setShowDetail(false)} icon={<ArrowLeft aria-hidden="true" />}>
                    All messages
                  </Button>
                </div>
                <ThreadView
                  selectedThreadId={mode === "inbox" ? selectedThreadId : null}
                  selectedThread={selectedThread}
                  messages={messages}
                  loadingThread={loadingThread}
                  onOpenReplyModal={() => setReplyOpen(true)}
                  senderSide={senderSide}
                />
              </div>
            </div>
          </div>
        }
      />

      <Modal
        open={!!openedMessage}
        onClose={() => setOpenedMessage(null)}
        title={openedMessage?.subject || "No subject"}
      >
        {openedMessage ? (
          <div className="flex flex-col gap-4">
            <p className="flex flex-wrap justify-between gap-2 text-sm text-muted">
              <span>
                To <span className="font-semibold text-ink">{openedMessage.receiver.name}</span>
              </span>
              <span>{new Date(openedMessage.created_at).toLocaleString()}</span>
            </p>
            <p className="whitespace-pre-wrap text-ink">{openedMessage.body}</p>
          </div>
        ) : null}
      </Modal>

      <ComposeView
        isOpen={composeOpen}
        userId={userId}
        senderSide={senderSide}
        mode="new"
        recipients={composeRecipients}
        onClose={() => setComposeOpen(false)}
        onCreated={handleRefreshAfterSend}
      />

      <ComposeView
        key={selectedThreadId ?? "none"}
        isOpen={replyOpen}
        userId={userId}
        senderSide={senderSide}
        mode="reply"
        recipients={lockedRecipient ? [lockedRecipient] : []}
        lockedRecipient={lockedRecipient}
        lockedSubject={selectedThread?.subject ?? ""}
        lockedThreadId={selectedThreadId ?? undefined}
        onClose={() => setReplyOpen(false)}
        onCreated={handleRefreshAfterSend}
      />
    </>
  );
}
