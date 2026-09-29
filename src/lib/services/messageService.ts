import "server-only";

import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import type { AuthUser } from "@/src/lib/utils/clientAuth";
import type {
  Message,
  MessageThread,
  CreateMessageThreadInput,
  ThreadWithMeta,
  ShelterMailboxFilter,
  SentMessageItem,
} from "@/src/lib/types/messages";
import { getAdoptionMetaMap } from "./adoptionService";

type SenderSide = "user" | "shelter";

function buildPreview(body: string, max = 120) {
  const cleaned = body.replace(/\s+/g, " ").trim();
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max)}...`;
}

function buildMessageInsert(
  threadId: string,
  side: SenderSide,
  senderId: string,
  body: string,
  now: string,
) {
  return {
    thread_id: threadId,
    sender_user_id: side === "user" ? senderId : null,
    sender_shelter_id: side === "shelter" ? senderId : null,
    body: body.trim(),
    created_at: now,
    read_by_user: side === "user",
    read_by_shelter: side === "shelter",
  };
}

async function getOwnedShelterId(ownerId: string): Promise<string | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .select("id")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data?.id ?? null;
}

/**
 * Works out which side of a conversation the caller is on:
 * a user sends as themselves, a shelter account as the shelter it owns.
 */
export async function getSenderIdentity(
  caller: AuthUser,
): Promise<{ side: SenderSide; id: string }> {
  if (caller.role === "user") return { side: "user", id: caller.id };

  if (caller.role === "shelter") {
    const shelterId = await getOwnedShelterId(caller.id);
    if (shelterId) return { side: "shelter", id: shelterId };
  }

  throw new ApiError(403, "This account can't send messages");
}

export async function createMessageThread(
  input: CreateMessageThreadInput,
): Promise<{ thread: MessageThread; message: Message }> {
  const supabase = await createServerSupabase();
  const threadType = input.threadType ?? "general";

  if (threadType === "adoption") {
    if (!input.adoptionRequestId) {
      throw new ApiError(
        400,
        "adoptionRequestId is required for adoption threads",
      );
    }

    // The adoption request must be between this user and this shelter
    const { data: request, error } = await supabase
      .from("adoption_requests")
      .select("id")
      .eq("id", input.adoptionRequestId)
      .eq("user_id", input.userId)
      .eq("shelter_id", input.shelterId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!request) throw new ApiError(404, "Adoption request not found");
  } else if (input.adoptionRequestId) {
    throw new ApiError(400, "General threads cannot have adoptionRequestId");
  }

  const now = new Date().toISOString();

  const { data: thread, error: threadError } = await supabase
    .from("message_threads")
    .insert({
      user_id: input.userId,
      shelter_id: input.shelterId,
      adoption_request_id:
        threadType === "adoption" ? (input.adoptionRequestId ?? null) : null,
      thread_type: threadType,
      subject: input.subject.trim(),
      created_at: now,
      updated_at: now,
      last_message_at: now,
    })
    .select("*")
    .single();

  if (threadError) throw new Error(threadError.message);

  const senderId = input.senderSide === "user" ? input.userId : input.shelterId;

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert(
      buildMessageInsert(thread.id, input.senderSide, senderId, input.body, now),
    )
    .select("*")
    .single();

  if (messageError) throw new Error(messageError.message);

  return {
    thread: thread as MessageThread,
    message: message as Message,
  };
}

/**
 * Loads a thread the caller takes part in. Returns 404 for anyone else so
 * thread ids can't be probed.
 */
export async function getThreadForCaller(
  threadId: string,
  caller: AuthUser,
): Promise<{ thread: MessageThread; side: SenderSide; senderId: string }> {
  const supabase = await createServerSupabase();

  const { data: thread, error } = await supabase
    .from("message_threads")
    .select("*")
    .eq("id", threadId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (thread) {
    if (caller.role === "user" && thread.user_id === caller.id) {
      return { thread, side: "user", senderId: caller.id };
    }

    if (caller.role === "shelter") {
      const shelterId = await getOwnedShelterId(caller.id);

      if (shelterId && thread.shelter_id === shelterId) {
        return { thread, side: "shelter", senderId: shelterId };
      }
    }
  }

  throw new ApiError(404, "Thread not found");
}

export async function replyToThread(
  threadId: string,
  caller: AuthUser,
  body: string,
): Promise<Message> {
  const { side, senderId } = await getThreadForCaller(threadId, caller);
  const supabase = await createServerSupabase();
  const now = new Date().toISOString();

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert(buildMessageInsert(threadId, side, senderId, body, now))
    .select("*")
    .single();

  if (messageError) throw new Error(messageError.message);

  const { error: updateThreadError } = await supabase
    .from("message_threads")
    .update({
      updated_at: now,
      last_message_at: now,
      user_archived: false,
      shelter_archived: false,
    })
    .eq("id", threadId);

  if (updateThreadError) throw new Error(updateThreadError.message);

  return message as Message;
}

export async function getThreadMessages(threadId: string): Promise<Message[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []) as Message[];
}

async function getLatestPreviewMap(
  threadIds: string[],
): Promise<Map<string, string | null>> {
  if (threadIds.length === 0) return new Map();

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("messages")
    .select("thread_id, body, created_at")
    .in("thread_id", threadIds)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const map = new Map<string, string | null>();

  for (const row of data ?? []) {
    const threadId = row.thread_id as string;

    if (!map.has(threadId)) {
      map.set(threadId, buildPreview((row.body as string) ?? ""));
    }
  }

  return map;
}

/** `userId` must come from the session. */
export async function getUserInboxThreads(
  userId: string,
): Promise<ThreadWithMeta[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("message_threads")
    .select("*")
    .eq("user_id", userId)
    .order("last_message_at", { ascending: false });

  if (error) throw new Error(error.message);

  const threads = (data ?? []) as MessageThread[];
  const adoptionRequestIds = threads
    .map((t) => t.adoption_request_id)
    .filter((id): id is string => Boolean(id));

  const [previewMap, adoptionMetaMap] = await Promise.all([
    getLatestPreviewMap(threads.map((t) => t.id)),
    getAdoptionMetaMap(adoptionRequestIds),
  ]);

  return threads.map((thread) => ({
    ...thread,
    adoption_status: thread.adoption_request_id
      ? (adoptionMetaMap.get(thread.adoption_request_id)?.status ?? null)
      : null,
    last_message_preview: previewMap.get(thread.id) ?? null,
    unread_count: 0,
    other_party: null,
  }));
}

/** `shelterId` must be the caller's own shelter. */
export async function getShelterInboxThreads(
  shelterId: string,
  filter: ShelterMailboxFilter = "inbox",
): Promise<ThreadWithMeta[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("message_threads")
    .select("*")
    .eq("shelter_id", shelterId)
    .order("last_message_at", { ascending: false });

  if (error) throw new Error(error.message);

  const threads = (data ?? []) as MessageThread[];

  const adoptionRequestIds = threads
    .map((t) => t.adoption_request_id)
    .filter((id): id is string => Boolean(id));

  const adoptionMetaMap = await getAdoptionMetaMap(adoptionRequestIds);

  const filteredThreads = threads.filter((thread) => {
    const status = thread.adoption_request_id
      ? (adoptionMetaMap.get(thread.adoption_request_id)?.status ?? null)
      : null;

    if (filter === "contacting_applicant")
      return status === "contacting_applicant";
    if (filter === "decision")
      return status === "approved" || status === "not_approved";
    if (filter === "final_outcome")
      return status === "adopted" || status === "withdrawn";

    return true;
  });

  const previewMap = await getLatestPreviewMap(
    filteredThreads.map((t) => t.id),
  );

  return filteredThreads.map((thread) => {
    const adoptionMeta = thread.adoption_request_id
      ? adoptionMetaMap.get(thread.adoption_request_id)
      : null;

    return {
      ...thread,
      pet_id: adoptionMeta?.pet_id ?? null,
      adoption_status: adoptionMeta?.status ?? null,
      last_message_preview: previewMap.get(thread.id) ?? null,
      unread_count: 0,
      other_party: null,
    };
  });
}

/** Messages the caller sent, with the other side of each thread as receiver. */
export async function getSentMessages(
  side: SenderSide,
  senderId: string,
): Promise<SentMessageItem[]> {
  const supabase = await createServerSupabase();

  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, body, created_at, thread_id")
    .eq(side === "user" ? "sender_user_id" : "sender_shelter_id", senderId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!messages?.length) return [];

  const threadIds = [...new Set(messages.map((m) => m.thread_id as string))];

  const { data: threads, error: threadError } = await supabase
    .from("message_threads")
    .select("id, subject, user_id, shelter_id")
    .in("id", threadIds);

  if (threadError) throw new Error(threadError.message);

  const threadMap = new Map((threads ?? []).map((t) => [t.id, t]));
  const receiverIdOf = (thread?: { user_id: string; shelter_id: string }) =>
    (side === "user" ? thread?.shelter_id : thread?.user_id) ?? "";

  const receiverIds = [
    ...new Set((threads ?? []).map(receiverIdOf).filter(Boolean)),
  ];

  const receivers = new Map<
    string,
    { name: string | null; image: string | null }
  >();

  if (receiverIds.length > 0 && side === "user") {
    const { data, error: shelterError } = await supabase
      .from("shelter")
      .select("id, shelter_name, logo_url")
      .in("id", receiverIds);

    if (shelterError) throw new Error(shelterError.message);

    for (const s of data ?? []) {
      receivers.set(s.id, { name: s.shelter_name, image: s.logo_url });
    }
  }

  if (receiverIds.length > 0 && side === "shelter") {
    const { data, error: userError } = await supabase
      .from("users")
      .select("id, full_name, username, photo_url")
      .in("id", receiverIds);

    if (userError) throw new Error(userError.message);

    for (const u of data ?? []) {
      receivers.set(u.id, {
        name: u.full_name ?? u.username,
        image: u.photo_url,
      });
    }
  }

  return messages.map((msg) => {
    const thread = threadMap.get(msg.thread_id as string);
    const receiverId = receiverIdOf(thread);
    const receiver = receivers.get(receiverId);

    return {
      id: msg.id as string,
      body: msg.body as string,
      created_at: msg.created_at as string,
      subject: thread?.subject ?? null,
      receiver: {
        id: receiverId,
        name:
          receiver?.name ??
          (side === "user" ? "Unknown Shelter" : "Unknown User"),
        image: receiver?.image ?? null,
        subtitle: null,
      },
    };
  });
}
