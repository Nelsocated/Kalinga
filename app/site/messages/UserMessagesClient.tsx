"use client";

import { useCallback, useMemo } from "react";
import MessagesLayout from "@/components/template/MessageTemplate";
import type {
  PersonCard,
  SentMessageItem,
  Message,
  ThreadWithMeta,
  ThreadResponse,
} from "@/lib/types/messages";
import type { ShelterOption } from "./page";

type MessageWithSender = Message & { sender: PersonCard };

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
  const enrichThread = useCallback(
    (thread: ThreadWithMeta): ThreadWithMeta => {
      const shelter =
        threadShelters.find((s) => s.id === thread.shelter_id) ??
        likedShelters.find((s) => s.id === thread.shelter_id) ??
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
    },
    [threadShelters, likedShelters],
  );

  const fetchThreads = useCallback(async () => {
    const res = await fetch(`/api/messages/threads?userId=${userId}`, {
      cache: "no-store",
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to load threads");
    return (result.data ?? []) as ThreadWithMeta[];
  }, [userId]);

  const fetchThread = useCallback(async (threadId: string) => {
    const res = await fetch(`/api/messages/threads/${threadId}`, {
      cache: "no-store",
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to load thread");
    return result.data as ThreadResponse;
  }, []);

  const fetchSentMessages = useCallback(async () => {
    const res = await fetch("/api/messages/sent", { cache: "no-store" });
    const result = await res.json();
    if (!res.ok)
      throw new Error(result.error || "Failed to load sent messages");
    return (result.data ?? []) as SentMessageItem[];
  }, []);

  const buildMessages = useCallback(
    (data: ThreadResponse): MessageWithSender[] => {
      const loadedThread = enrichThread(data.thread);
      const shelterFromLists =
        threadShelters.find((s) => s.id === loadedThread.shelter_id) ??
        likedShelters.find((s) => s.id === loadedThread.shelter_id) ??
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

      return (data.messages ?? []).map((message) => ({
        ...message,
        sender: message.sender_user_id ? currentUserCard : shelterCard,
      }));
    },
    [enrichThread, threadShelters, likedShelters, currentUserCard],
  );

  const composeRecipients = useMemo(
    () =>
      likedShelters.map((shelter) => ({
        id: shelter.id,
        name: shelter.name,
        image: shelter.logo_url,
        subtitle: shelter.location,
        type: "shelter" as const,
      })),
    [likedShelters],
  );

  return (
    <MessagesLayout
      userId={userId}
      senderSide="user"
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
