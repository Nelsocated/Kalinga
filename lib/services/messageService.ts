import "server-only";

import { createServerSupabase } from "@/lib/supabase/server";
import type {
  Message,
  MessageThread,
  CreateMessageThreadInput,
  ReplyToThreadInput,
  ThreadWithMeta,
  ShelterMailboxFilter,
} from "@/lib/types/messages";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

function buildPreview(body: string, max = 120) {
  const cleaned = body.replace(/\s+/g, " ").trim();
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max)}...`;
}

async function getAuthUserId() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  if (!user) throw new Error("Unauthorized");

  return user.id;
}

async function getOwnedShelterIds(authUserId: string): Promise<string[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .select("id")
    .eq("user_id", authUserId);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => row.id as string);
}

export async function createMessageThread(
  input: CreateMessageThreadInput,
): Promise<{ thread: MessageThread; message: Message }> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();

  const threadType = input.threadType ?? "general";

  if (threadType === "adoption" && !input.adoptionRequestId) {
    throw new Error("adoptionRequestId is required for adoption threads");
  }

  if (threadType === "general" && input.adoptionRequestId) {
    throw new Error("General threads cannot have adoptionRequestId");
  }

  if (input.senderSide === "user" && authUserId !== input.userId) {
    throw new Error("You can only create a user thread for yourself");
  }

  if (input.senderSide === "shelter") {
    const shelterIds = await getOwnedShelterIds(authUserId);

    if (!shelterIds.includes(input.shelterId)) {
      throw new Error("You do not own this shelter");
    }
  }

  const now = new Date().toISOString();

  const threadInsert = {
    user_id: input.userId,
    shelter_id: input.shelterId,
    adoption_request_id:
      threadType === "adoption" ? (input.adoptionRequestId ?? null) : null,
    thread_type: threadType,
    subject: input.subject.trim(),
    created_at: now,
    updated_at: now,
    last_message_at: now,
    user_archived: false,
    shelter_archived: false,
    user_deleted: false,
    shelter_deleted: false,
  };

  const { data: thread, error: threadError } = await supabase
    .from("message_threads")
    .insert(threadInsert)
    .select("*")
    .single();

  if (threadError) throw new Error(threadError.message);
  if (!thread) throw new Error("Failed to create message thread");

  const messageInsert =
    input.senderSide === "user"
      ? {
          thread_id: thread.id,
          sender_user_id: input.userId,
          sender_shelter_id: null,
          body: input.body.trim(),
          created_at: now,
          read_by_user: true,
          read_by_shelter: false,
        }
      : {
          thread_id: thread.id,
          sender_user_id: null,
          sender_shelter_id: input.shelterId,
          body: input.body.trim(),
          created_at: now,
          read_by_user: false,
          read_by_shelter: true,
        };

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert(messageInsert)
    .select("*")
    .single();

  if (messageError) throw new Error(messageError.message);
  if (!message) throw new Error("Failed to create first message");

  return {
    thread: thread as MessageThread,
    message: message as Message,
  };
}

export async function replyToThread(
  input: ReplyToThreadInput,
): Promise<Message> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();

  const { data: thread, error: threadError } = await supabase
    .from("message_threads")
    .select("*")
    .eq("id", input.threadId)
    .single();

  if (threadError) throw new Error(threadError.message);
  if (!thread) throw new Error("Thread not found");

  if (thread.user_deleted && input.senderSide === "user") {
    throw new Error("This thread is deleted for the user");
  }

  if (thread.shelter_deleted && input.senderSide === "shelter") {
    throw new Error("This thread is deleted for the shelter");
  }

  const now = new Date().toISOString();

  let messageInsert:
    | {
        thread_id: string;
        sender_user_id: string;
        sender_shelter_id: null;
        body: string;
        created_at: string;
        read_by_user: boolean;
        read_by_shelter: boolean;
      }
    | {
        thread_id: string;
        sender_user_id: null;
        sender_shelter_id: string;
        body: string;
        created_at: string;
        read_by_user: boolean;
        read_by_shelter: boolean;
      };

  if (input.senderSide === "user") {
    if (thread.user_id !== authUserId) {
      throw new Error("Unauthorized to reply as user");
    }

    messageInsert = {
      thread_id: input.threadId,
      sender_user_id: authUserId,
      sender_shelter_id: null,
      body: input.body.trim(),
      created_at: now,
      read_by_user: true,
      read_by_shelter: false,
    };
  } else {
    const shelterIds = await getOwnedShelterIds(authUserId);
    const senderShelterId = input.senderShelterId ?? thread.shelter_id;

    if (
      !shelterIds.includes(senderShelterId) ||
      senderShelterId !== thread.shelter_id
    ) {
      throw new Error("Unauthorized to reply as shelter");
    }

    messageInsert = {
      thread_id: input.threadId,
      sender_user_id: null,
      sender_shelter_id: senderShelterId,
      body: input.body.trim(),
      created_at: now,
      read_by_user: false,
      read_by_shelter: true,
    };
  }

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert(messageInsert)
    .select("*")
    .single();

  if (messageError) throw new Error(messageError.message);
  if (!message) throw new Error("Failed to send reply");

  const { error: updateThreadError } = await supabase
    .from("message_threads")
    .update({
      updated_at: now,
      last_message_at: now,
      user_archived: false,
      shelter_archived: false,
    })
    .eq("id", input.threadId);

  if (updateThreadError) throw new Error(updateThreadError.message);

  return message as Message;
}

export async function getThreadById(
  threadId: string,
): Promise<MessageThread | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("message_threads")
    .select("*")
    .eq("id", threadId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data as MessageThread;
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

async function getUnreadCountMap(
  threadIds: string[],
  side: "user" | "shelter",
): Promise<Map<string, number>> {
  const supabase = await createServerSupabase();

  if (threadIds.length === 0) return new Map();

  const unreadColumn = side === "user" ? "read_by_user" : "read_by_shelter";
  const senderNullColumn =
    side === "user" ? "sender_user_id" : "sender_shelter_id";

  const { data, error } = await supabase
    .from("messages")
    .select(`thread_id`)
    .in("thread_id", threadIds)
    .eq(unreadColumn, false)
    .not(senderNullColumn, "is", null);

  if (error) throw new Error(error.message);

  const map = new Map<string, number>();

  for (const row of data ?? []) {
    const threadId = row.thread_id as string;
    map.set(threadId, (map.get(threadId) ?? 0) + 1);
  }

  return map;
}

async function getLatestPreviewMap(
  threadIds: string[],
): Promise<Map<string, string | null>> {
  const supabase = await createServerSupabase();

  if (threadIds.length === 0) return new Map();

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

async function getAdoptionStatusMap(
  adoptionRequestIds: string[],
): Promise<Map<string, string | null>> {
  const supabase = await createServerSupabase();

  if (adoptionRequestIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("adoption_requests")
    .select("id, status")
    .in("id", adoptionRequestIds);

  if (error) throw new Error(error.message);

  const map = new Map<string, string | null>();

  for (const row of data ?? []) {
    map.set(row.id as string, (row.status as string) ?? null);
  }

  return map;
}

export async function getUserInboxThreads(
  userId: string,
): Promise<ThreadWithMeta[]> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();

  if (authUserId !== userId) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("message_threads")
    .select("*")
    .eq("user_id", userId)
    .eq("user_deleted", false)
    .order("last_message_at", { ascending: false });

  if (error) throw new Error(error.message);

  const threads = (data ?? []) as MessageThread[];
  const threadIds = threads.map((t) => t.id);
  const adoptionRequestIds = threads
    .map((t) => t.adoption_request_id)
    .filter((id): id is string => Boolean(id));

  const unreadMap = await getUnreadCountMap(threadIds, "user");
  const previewMap = await getLatestPreviewMap(threadIds);
  const adoptionStatusMap = await getAdoptionStatusMap(adoptionRequestIds);

  return threads.map((thread) => ({
    ...thread,
    adoption_status: thread.adoption_request_id
      ? (adoptionStatusMap.get(thread.adoption_request_id) ?? null)
      : null,
    last_message_preview: previewMap.get(thread.id) ?? null,
    unread_count: unreadMap.get(thread.id) ?? 0,
  }));
}

export async function getShelterInboxThreads(
  shelterId: string,
  filter: ShelterMailboxFilter = "inbox",
): Promise<ThreadWithMeta[]> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();
  const shelterIds = await getOwnedShelterIds(authUserId);

  if (!shelterIds.includes(shelterId)) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("message_threads")
    .select("*")
    .eq("shelter_id", shelterId)
    .eq("shelter_deleted", false)
    .order("last_message_at", { ascending: false });

  if (error) throw new Error(error.message);

  const threads = (data ?? []) as MessageThread[];
  const adoptionRequestIds = threads
    .map((t) => t.adoption_request_id)
    .filter((id): id is string => Boolean(id));

  const adoptionStatusMap = await getAdoptionStatusMap(adoptionRequestIds);

  const filteredThreads = threads.filter((thread) => {
    const status = thread.adoption_request_id
      ? (adoptionStatusMap.get(thread.adoption_request_id) ?? null)
      : null;

    if (filter === "inbox") return true;
    if (filter === "contacting_applicant")
      return status === "contacting_applicant";
    if (filter === "decision")
      return status === "approved" || status === "not_approved";
    if (filter === "final_outcome")
      return status === "adopted" || status === "withdrawn";

    return true;
  });

  const filteredThreadIds = filteredThreads.map((t) => t.id);
  const unreadMap = await getUnreadCountMap(filteredThreadIds, "shelter");
  const previewMap = await getLatestPreviewMap(filteredThreadIds);

  return filteredThreads.map((thread) => ({
    ...thread,
    adoption_status: thread.adoption_request_id
      ? (adoptionStatusMap.get(thread.adoption_request_id) ?? null)
      : null,
    last_message_preview: previewMap.get(thread.id) ?? null,
    unread_count: unreadMap.get(thread.id) ?? 0,
  }));
}

export async function markThreadAsReadForUser(threadId: string): Promise<void> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();

  const { data: thread, error: threadError } = await supabase
    .from("message_threads")
    .select("id, user_id")
    .eq("id", threadId)
    .single();

  if (threadError) throw new Error(threadError.message);
  if (!thread || thread.user_id !== authUserId) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("messages")
    .update({ read_by_user: true })
    .eq("thread_id", threadId)
    .neq("sender_user_id", authUserId);

  if (error) throw new Error(error.message);
}

export async function markThreadAsReadByUser(threadId: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("message_thread_reads").upsert(
    {
      thread_id: threadId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      read_at: new Date().toISOString(),
    },
    { onConflict: "thread_id,user_id" },
  );

  if (error) throw new Error(error.message);
}

export async function markThreadAsReadForShelter(
  threadId: string,
): Promise<void> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();
  const shelterIds = await getOwnedShelterIds(authUserId);

  const { data: thread, error: threadError } = await supabase
    .from("message_threads")
    .select("id, shelter_id")
    .eq("id", threadId)
    .single();

  if (threadError) throw new Error(threadError.message);
  if (!thread || !shelterIds.includes(thread.shelter_id as string)) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("messages")
    .update({ read_by_shelter: true })
    .eq("thread_id", threadId)
    .neq("sender_shelter_id", thread.shelter_id);

  if (error) throw new Error(error.message);
}

export async function archiveThreadForUser(threadId: string): Promise<void> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();

  const { data: thread, error: threadError } = await supabase
    .from("message_threads")
    .select("id, user_id")
    .eq("id", threadId)
    .single();

  if (threadError) throw new Error(threadError.message);
  if (!thread || thread.user_id !== authUserId) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("message_threads")
    .update({ user_archived: true })
    .eq("id", threadId);

  if (error) throw new Error(error.message);
}

export async function archiveThreadForShelter(threadId: string): Promise<void> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();
  const shelterIds = await getOwnedShelterIds(authUserId);

  const { data: thread, error: threadError } = await supabase
    .from("message_threads")
    .select("id, shelter_id")
    .eq("id", threadId)
    .single();

  if (threadError) throw new Error(threadError.message);
  if (!thread || !shelterIds.includes(thread.shelter_id as string)) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("message_threads")
    .update({ shelter_archived: true })
    .eq("id", threadId);

  if (error) throw new Error(error.message);
}

export async function softDeleteThreadForUser(threadId: string): Promise<void> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();

  const { data: thread, error: threadError } = await supabase
    .from("message_threads")
    .select("id, user_id")
    .eq("id", threadId)
    .single();

  if (threadError) throw new Error(threadError.message);
  if (!thread || thread.user_id !== authUserId) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("message_threads")
    .update({ user_deleted: true })
    .eq("id", threadId);

  if (error) throw new Error(error.message);
}

export async function softDeleteThreadForShelter(
  threadId: string,
): Promise<void> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();
  const shelterIds = await getOwnedShelterIds(authUserId);

  const { data: thread, error: threadError } = await supabase
    .from("message_threads")
    .select("id, shelter_id")
    .eq("id", threadId)
    .single();

  if (threadError) throw new Error(threadError.message);
  if (!thread || !shelterIds.includes(thread.shelter_id as string)) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("message_threads")
    .update({ shelter_deleted: true })
    .eq("id", threadId);

  if (error) throw new Error(error.message);
}

export async function safeCreateMessageThread(input: CreateMessageThreadInput) {
  try {
    return await createMessageThread(input);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function safeReplyToThread(input: ReplyToThreadInput) {
  try {
    return await replyToThread(input);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getUserSentMessages(userId: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      id,
      body,
      created_at,
      message_threads (
        subject,
        shelter_id
      )
    `,
    )
    .eq("sender_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    body: row.body,
    created_at: row.created_at,
    subject: row.message_threads?.subject ?? "",
    shelter_id: row.message_threads?.shelter_id,
  }));
}
