import "server-only";

import { createServerSupabase } from "@/src/lib/supabase/server";
import type {
  SentMessageItem,
} from "@/src/lib/types/messages";
import type { SenderSide } from "./threads";


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
