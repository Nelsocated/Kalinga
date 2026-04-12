"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WebTemplate from "@/components/template/WebTemplate";
import MessagesTabs from "@/components/tabs/MessagesTabs";
import ThreadList from "@/components/lists/ThreadList";
import ThreadView from "@/components/views/ThreadView";
import ComposeView from "@/components/views/ComposeView";
import SentMessagesList from "@/components/lists/SentMessagesList";
import BackButton from "@/components/ui/BackButton";
import type {
  PersonCard,
  SentMessageItem,
  Message,
  ThreadWithMeta,
  ThreadResponse,
  ComposeRecipient,
} from "@/lib/types/messages";

type ViewMode = "inbox" | "compose";

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
  const [mode, setMode] = useState<ViewMode>("inbox");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [threads, setThreads] = useState<ThreadWithMeta[]>(() =>
    initialThreads.map(enrichThread),
  );
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    initialThreads[0]?.id ?? null,
  );
  const [selectedThread, setSelectedThread] = useState<ThreadWithMeta | null>(
    initialThreads[0] ? enrichThread(initialThreads[0]) : null,
  );
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [sentMessages, setSentMessages] = useState<SentMessageItem[]>([]);
  const [openedMessage, setOpenedMessage] = useState<SentMessageItem | null>(
    null,
  );
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
      const raw = await fetchThreads();
      const next = raw.map(enrichThread);
      setThreads(next);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load threads");
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

        const existingThread = threadsRef.current.find(
          (t) => t.id === threadId,
        );
        const mergedThread: ThreadWithMeta = {
          ...data.thread,
          other_party:
            data.thread.other_party ?? existingThread?.other_party ?? null,
        };

        const loadedThread = enrichThread(mergedThread);
        setSelectedThread(loadedThread);
        setMessages(buildMessages({ ...data, thread: mergedThread }));
        setThreads((prev) =>
          prev.map((t) =>
            t.id !== loadedThread.id
              ? t
              : enrichThread({
                  ...t,
                  ...loadedThread,
                  last_message_preview:
                    loadedThread.last_message_preview?.trim() ||
                    t.last_message_preview ||
                    null,
                }),
          ),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load thread");
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
      const data = await fetchSentMessages();
      setSentMessages(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load sent messages",
      );
    } finally {
      setLoadingSent(false);
    }
  }, [fetchSentMessages]);

  const buildLockedRecipient = (thread: ThreadWithMeta | null) => {
    if (!thread?.other_party) return null;
    return {
      id: thread.other_party.id,
      name: thread.other_party.name,
      image: thread.other_party.image ?? null,
      subtitle: thread.other_party.subtitle ?? null,
      type: senderSide === "user" ? ("shelter" as const) : ("user" as const),
    };
  };

  useEffect(() => {
    setThreads(initialThreads.map(enrichThread));
    setSelectedThreadId((prev) => prev ?? initialThreads[0]?.id ?? null);
    setSelectedThread(
      (prev) =>
        prev ?? (initialThreads[0] ? enrichThread(initialThreads[0]) : null),
    );
  }, [initialThreads, enrichThread]);

  useEffect(() => {
    if (mode === "inbox" && selectedThreadId) void loadThread(selectedThreadId);
  }, [mode, selectedThreadId, loadThread]);

  useEffect(() => {
    if (mode === "compose") void loadSentMessages();
  }, [mode, loadSentMessages]);

  async function handleRefreshAfterSend(threadId: string) {
    setMode("inbox");
    setIsReplyModalOpen(false);
    const next = await loadThreads();
    const nextId =
      next.find((t) => t.id === threadId)?.id ?? next[0]?.id ?? null;
    setSelectedThreadId(nextId);
    if (nextId) await loadThread(nextId);
    else {
      setSelectedThread(null);
      setMessages([]);
    }
  }

  const lockedRecipient = buildLockedRecipient(selectedThread);

  return (
    <>
      <WebTemplate
        header={<div>Messages</div>}
        scrollable={false}
        main={
          <div className="grid h-full min-h-0 grid-cols-[320px_1fr] overflow-hidden">
            <div className="flex min-h-0 flex-col border-r bg-white">
              <MessagesTabs mode={mode} setMode={setMode} />
              <div className="min-h-0 w-full flex-1 overflow-hidden">
                {mode === "inbox" ? (
                  <ThreadList
                    threads={threads}
                    selectedThreadId={selectedThreadId}
                    loading={loadingThreads}
                    onSelectThread={setSelectedThreadId}
                    withStatus={senderSide === "shelter"}
                  />
                ) : (
                  <SentMessagesList
                    items={sentMessages}
                    loading={loadingSent}
                    onOpenMessage={(item: SentMessageItem) =>
                      setOpenedMessage(item)
                    }
                  />
                )}
              </div>
            </div>

            <div className="min-h-0 overflow-hidden">
              {mode === "inbox" ? (
                <ThreadView
                  selectedThreadId={selectedThreadId}
                  selectedThread={selectedThread}
                  messages={messages}
                  loadingThread={loadingThread}
                  onOpenReplyModal={() => setIsReplyModalOpen(true)}
                />
              ) : (
                <ComposeView
                  userId={userId}
                  senderSide={senderSide}
                  mode="new"
                  recipients={composeRecipients}
                  onCreated={handleRefreshAfterSend}
                  adoptionRequestId={
                    senderSide === "shelter"
                      ? selectedThread?.adoption_request_id ?? undefined
                      : undefined
                  }
                />
              )}
            </div>
          </div>
        }
      />

      {error ? (
        <div className="fixed right-6 bottom-6 z-40 rounded-[15px] border bg-white px-4 py-2 text-description text-red-500 shadow">
          {error}
        </div>
      ) : null}

      {openedMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-xl rounded-[15px] border bg-white shadow-lg">
            <div className="border-b px-5 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-subtitle font-bold text-black">
                  {openedMessage.subject || "(No subject)"}
                </h2>
                <BackButton
                  className="h-7 w-7"
                  onClick={() => setOpenedMessage(null)}
                />
              </div>
            </div>
            <div className="scroll-stable overflow-y-auto px-5 py-4">
              <div className="flex justify-between">
                <p className="text-description">
                  To:{" "}
                  <span className="font-semibold">
                    {openedMessage.receiver.name}
                  </span>
                </p>
                <p className="text-xs text-neutral-400">
                  {new Date(openedMessage.created_at).toLocaleString()}
                </p>
              </div>
              <p className="mt-7 whitespace-pre-wrap text-lg leading-6 text-black">
                {openedMessage.body}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <ComposeView
        isModal
        isOpen={isReplyModalOpen}
        userId={userId}
        senderSide={senderSide}
        senderShelterId={senderSide === "shelter" ? userId : undefined}
        mode="reply"
        recipients={lockedRecipient ? [lockedRecipient] : []}
        lockedRecipient={lockedRecipient}
        lockedSubject={selectedThread?.subject ?? ""}
        lockedThreadId={selectedThreadId ?? undefined}
        onClose={() => setIsReplyModalOpen(false)}
        onCreated={handleRefreshAfterSend}
        adoptionRequestId={
          senderSide === "shelter"
            ? (selectedThread?.adoption_request_id ?? undefined)
            : undefined
        }
      />
    </>
  );
}
