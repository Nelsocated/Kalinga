"use client";

import { useCallback, useMemo } from "react";
import MessagesLayout from "@/components/template/MessageTemplate";
import type {
  PersonCard,
  SentMessageItem,
  Message,
  ThreadWithMeta,
  ThreadResponse,
  ComposeRecipient,
} from "@/lib/types/messages";

type Props = {
  shelterId: string;
  currentShelterCard: PersonCard;
  initialThreads: ThreadWithMeta[];
};

export default function ShelterMessagesClient({
  shelterId,
  currentShelterCard,
  initialThreads,
}: Props) {
  const enrichThread = useCallback(
    (thread: ThreadWithMeta): ThreadWithMeta => thread,
    [],
  );

  const fetchThreads = useCallback(async (): Promise<ThreadWithMeta[]> => {
    const res = await fetch(`/api/messages/threads?shelterId=${shelterId}`, {
      cache: "no-store",
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error ?? "Failed to load threads");
    return (result.data ?? []) as ThreadWithMeta[];
  }, [shelterId]);

  const fetchThread = useCallback(
    async (threadId: string): Promise<ThreadResponse> => {
      const res = await fetch(`/api/messages/threads/${threadId}`, {
        cache: "no-store",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Failed to load thread");
      return result.data as ThreadResponse;
    },
    [],
  );

  const fetchSentMessages = useCallback(async (): Promise<
    SentMessageItem[]
  > => {
    const res = await fetch(`/api/messages/sent`, { cache: "no-store" });
    const result = await res.json();
    if (!res.ok)
      throw new Error(result.error ?? "Failed to load sent messages");
    return (result.data ?? []) as SentMessageItem[];
  }, []);

  const buildMessages = useCallback(
    (data: ThreadResponse): (Message & { sender: PersonCard })[] => {
      const thread = data.thread;

      const userCard: PersonCard = {
        id: thread.other_party?.id ?? thread.user_id,
        name: thread.other_party?.name ?? "User",
        image: thread.other_party?.image ?? null,
        subtitle: thread.other_party?.subtitle ?? null,
      };

      return data.messages.map((message) => ({
        ...message,
        sender: message.sender_shelter_id ? currentShelterCard : userCard,
      }));
    },
    [currentShelterCard],
  );

  const composeRecipients = useMemo<ComposeRecipient[]>(
    () =>
      initialThreads
        .filter((t) => t.other_party != null)
        .map((t) => ({
          id: t.other_party!.id,
          name: t.other_party!.name,
          image: t.other_party!.image ?? null,
          subtitle: t.other_party!.subtitle ?? null,
          type: "user" as const,
        }))
        .filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i),
    [initialThreads],
  );

  return (
    <MessagesLayout
      userId={shelterId}
      senderSide="shelter"
      initialThreads={initialThreads}
      enrichThread={enrichThread}
      fetchThreads={fetchThreads}
      fetchThread={fetchThread}
      fetchSentMessages={fetchSentMessages}
      buildMessages={buildMessages}
      composeRecipients={composeRecipients}
    />
  );
}
