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
import { getAdoptionMetaMap } from "./adoption/adoptionService";

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
    .eq("owner_id", authUserId); // ← was user_id

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

  if (authUserId !== userId) throw new Error("Unauthorized");

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

  const previewMap = await getLatestPreviewMap(threadIds);
  const adoptionStatusMap = await getAdoptionStatusMap(adoptionRequestIds);

  return threads.map((thread) => ({
    ...thread,
    adoption_status: thread.adoption_request_id
      ? (adoptionStatusMap.get(thread.adoption_request_id) ?? null)
      : null,
    last_message_preview: previewMap.get(thread.id) ?? null,
    unread_count: 0,
    other_party: null,
  }));
}

export async function getShelterInboxThreads(
  shelterId: string,
  filter: ShelterMailboxFilter = "inbox",
): Promise<ThreadWithMeta[]> {
  const supabase = await createServerSupabase();
  const authUserId = await getAuthUserId();
  const shelterIds = await getOwnedShelterIds(authUserId);

  if (!shelterIds.includes(shelterId)) throw new Error("Unauthorized");

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
    const adoptionMeta = thread.adoption_request_id
      ? adoptionMetaMap.get(thread.adoption_request_id)
      : null;

    const status = adoptionMeta?.status ?? null;

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
  const previewMap = await getLatestPreviewMap(filteredThreadIds);

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

  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, body, created_at, thread_id")
    .eq("sender_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!messages?.length) return [];

  const threadIds = [...new Set(messages.map((m) => m.thread_id as string))];

  const { data: threads, error: threadError } = await supabase
    .from("message_threads")
    .select("id, subject, shelter_id")
    .in("id", threadIds);

  if (threadError) throw new Error(threadError.message);

  const shelterIds = [
    ...new Set(
      (threads ?? []).map((t) => t.shelter_id as string).filter(Boolean),
    ),
  ];

  const { data: shelters, error: shelterError } = await supabase
    .from("shelter")
    .select("id, shelter_name, logo_url")
    .in("id", shelterIds.length > 0 ? shelterIds : ["__none__"]);

  if (shelterError) throw new Error(shelterError.message);

  const threadMap = new Map((threads ?? []).map((t) => [t.id, t]));
  const shelterMap = new Map((shelters ?? []).map((s) => [s.id, s]));

  return messages.map((msg) => {
    const thread = threadMap.get(msg.thread_id as string);
    const shelter = thread?.shelter_id
      ? shelterMap.get(thread.shelter_id)
      : null;

    return {
      id: msg.id as string,
      body: msg.body as string,
      created_at: msg.created_at as string,
      subject: thread?.subject ?? null,
      receiver: {
        id: shelter?.id ?? thread?.shelter_id ?? "",
        name: shelter?.shelter_name ?? "Unknown Shelter",
        image: shelter?.logo_url ?? null,
        subtitle: null,
      },
    };
  });
}
