"use client";

import { useEffect, useMemo, useState } from "react";
import MessagesTabs from "@/components/tabs/MessagesTabs";
import ThreadList from "@/components/lists/ThreadList";
import ThreadView from "@/components/views/ThreadView";
import ComposeView from "@/components/views/ComposeView";
import SentMessagesList from "@/components/lists/SentMessagesList";
import BackButton from "@/components/ui/BackButton";
import type {
  PersonCard,
  SentMessageItem,
  MessageThread,
  Message,
} from "@/lib/types/messages";
import type { ShelterOption } from "./page";

type ViewMode = "inbox" | "compose";

type MessageWithSender = Message & {
  sender: PersonCard;
};

type ThreadWithMeta = MessageThread & {
  adoption_status: string | null;
  last_message_preview: string | null;
  unread_count: number;
  other_party: PersonCard | null;
};

type ThreadResponse = {
  thread: ThreadWithMeta;
  messages: Message[];
};

type Props = {
  userId: string;
  currentUserCard: PersonCard;
  initialThreads: ThreadWithMeta[];
  likedShelters: ShelterOption[];
  threadShelters: ShelterOption[];
};

export default function UserMessagesClient({
  userId,
  currentUserCard,
  initialThreads,
  likedShelters,
  threadShelters,
}: Props) {
  const [mode, setMode] = useState<ViewMode>("inbox");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  function enrichThread(thread: ThreadWithMeta): ThreadWithMeta {
    const shelter =
      threadShelters.find((item) => item.id === thread.shelter_id) ??
      likedShelters.find((item) => item.id === thread.shelter_id) ??
      null;

    return {
      ...thread,
      other_party: {
        id: thread.other_party?.id || thread.shelter_id || "",
        name: thread.other_party?.name || shelter?.name || "Shelter",
        image: thread.other_party?.image || shelter?.logo_url || null,
        subtitle: thread.other_party?.subtitle || shelter?.location || null,
      },
    };
  }

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

  const threadShelter = useMemo<ShelterOption | null>(() => {
    if (!selectedThread?.shelter_id) return null;

    return (
      threadShelters.find(
        (shelter: ShelterOption) => shelter.id === selectedThread.shelter_id,
      ) ??
      likedShelters.find(
        (shelter: ShelterOption) => shelter.id === selectedThread.shelter_id,
      ) ??
      null
    );
  }, [selectedThread, threadShelters, likedShelters]);

  async function loadThreads() {
    try {
      setLoadingThreads(true);
      setError(null);

      const res = await fetch(`/api/messages/user/threads?userId=${userId}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to load threads");
      }

      const nextThreads = ((result.data ?? []) as ThreadWithMeta[]).map(
        enrichThread,
      );

      setThreads(nextThreads);
      return nextThreads;
    } catch (err) {
      console.error("[loadThreads]", err);
      setError(err instanceof Error ? err.message : "Failed to load threads");
      return [];
    } finally {
      setLoadingThreads(false);
    }
  }

  async function loadThread(threadId: string) {
    try {
      setLoadingThread(true);
      setError(null);

      const res = await fetch(`/api/messages/user/threads/${threadId}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to load thread");
      }

      const data = result.data as ThreadResponse;
      const loadedThread = enrichThread(data.thread);
      setSelectedThread(loadedThread);

      const shelterFromLists =
        threadShelters.find((item) => item.id === loadedThread.shelter_id) ??
        likedShelters.find((item) => item.id === loadedThread.shelter_id) ??
        null;

      const shelterCard: PersonCard = {
        id: loadedThread.other_party?.id || loadedThread.shelter_id || "",
        name:
          loadedThread.other_party?.name || shelterFromLists?.name || "Shelter",
        image:
          loadedThread.other_party?.image || shelterFromLists?.logo_url || null,
        subtitle:
          loadedThread.other_party?.subtitle ||
          shelterFromLists?.location ||
          null,
      };

      const enrichedMessages: MessageWithSender[] = (data.messages ?? []).map(
        (message) => {
          const isUserSender = Boolean(message.sender_user_id);

          return {
            ...message,
            sender: isUserSender ? currentUserCard : shelterCard,
          };
        },
      );

      setMessages(enrichedMessages);

      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id !== loadedThread.id) return thread;

          return enrichThread({
            ...thread,
            ...loadedThread,
            last_message_preview:
              loadedThread.last_message_preview?.trim() ||
              thread.last_message_preview ||
              null,
          });
        }),
      );
    } catch (err) {
      console.error("[loadThread]", err);
      setError(err instanceof Error ? err.message : "Failed to load thread");
    } finally {
      setLoadingThread(false);
    }
  }

  async function loadSentMessages() {
    try {
      setLoadingSent(true);
      setError(null);

      const res = await fetch("/api/messages/user/sent", {
        method: "GET",
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to load sent messages");
      }

      setSentMessages((result.data ?? []) as SentMessageItem[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load sent messages",
      );
    } finally {
      setLoadingSent(false);
    }
  }

  useEffect(() => {
    if (initialThreads.length === 0) {
      void loadThreads();
    }
  }, [initialThreads.length, userId]);

  useEffect(() => {
    if (mode === "inbox" && selectedThreadId) {
      void loadThread(selectedThreadId);
    }
  }, [mode, selectedThreadId]);

  useEffect(() => {
    if (mode === "compose") {
      void loadSentMessages();
    }
  }, [mode]);

  async function handleRefreshAfterSend(threadId: string) {
    setMode("inbox");
    setIsReplyModalOpen(false);

    const nextThreads = await loadThreads();

    const nextSelectedId =
      nextThreads.find((thread) => thread.id === threadId)?.id ??
      nextThreads[0]?.id ??
      null;

    setSelectedThreadId(nextSelectedId);

    if (nextSelectedId) {
      await loadThread(nextSelectedId);
    } else {
      setSelectedThread(null);
      setMessages([]);
    }
  }

  return (
    <div className="relative flex h-screen w-full justify-center bg-background pl-20">
      <div className="h-screen w-full max-w-5xl overflow-hidden rounded-[15px] border-2 bg-white">
        <div className="flex items-center bg-primary px-5">
          <h1 className="text-header font-bold text-black">Messages</h1>
          <BackButton />
        </div>

        <div
          className="grid min-h-0 grid-cols-[320px_1fr]"
          style={{ height: "calc(100vh - 72px)" }}
        >
          <div className="flex min-h-0 flex-col border-r bg-white">
            <MessagesTabs mode={mode} setMode={setMode} />

            <div className="min-h-0 w-full flex-1 overflow-hidden">
              {mode === "inbox" ? (
                <ThreadList
                  threads={threads}
                  selectedThreadId={selectedThreadId}
                  loading={loadingThreads}
                  onSelectThread={setSelectedThreadId}
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

          <div className="flex min-h-0 flex-col overflow-hidden bg-white">
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
                mode="new"
                shelters={likedShelters}
                onCreated={handleRefreshAfterSend}
              />
            )}
          </div>
        </div>

        {error ? (
          <div className="border-t px-4 py-2 text-description text-red-500">
            {error}
          </div>
        ) : null}
      </div>

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
                <p className="text-subtitle">
                  To:{" "}
                  <span className="font-semibold">
                    {openedMessage.receiver.name}
                  </span>
                </p>

                <p className="text-xs text-neutral-400">
                  {new Date(openedMessage.created_at).toLocaleString()}
                </p>
              </div>

              <p className="mt-7 whitespace-pre-wrap text-description leading-6 text-black">
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
        mode="reply"
        shelters={[]}
        lockedShelter={
          threadShelter
            ? {
                id: threadShelter.id,
                name: threadShelter.name,
                logo_url: threadShelter.logo_url ?? null,
                location: threadShelter.location ?? null,
              }
            : selectedThread?.other_party
              ? {
                  id: selectedThread.other_party.id,
                  name: selectedThread.other_party.name,
                  logo_url: selectedThread.other_party.image ?? null,
                  location: selectedThread.other_party.subtitle ?? null,
                }
              : null
        }
        lockedSubject={selectedThread?.subject ?? ""}
        lockedThreadId={selectedThreadId ?? undefined}
        onClose={() => setIsReplyModalOpen(false)}
        onCreated={handleRefreshAfterSend}
      />
    </div>
  );
}
