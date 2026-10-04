import "server-only";

import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import type { AuthUser } from "@/src/lib/utils/clientAuth";
import type {
  Message,
  MessageThread,
  CreateMessageThreadInput,
} from "@/src/lib/types/messages";


export type SenderSide = "user" | "shelter";

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
    .update({ updated_at: now, last_message_at: now })
    .eq("id", threadId);

  if (updateThreadError) throw new Error(updateThreadError.message);

  return message as Message;
}

/** Marks the other side's messages in a thread as read by the caller. */
export async function markThreadRead(threadId: string, caller: AuthUser): Promise<void> {
  const { side } = await getThreadForCaller(threadId, caller);
  const column = side === "user" ? "read_by_user" : "read_by_shelter";
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("messages")
    .update({ [column]: true })
    .eq("thread_id", threadId)
    .eq(column, false);

  if (error) throw new Error(error.message);
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
