import "server-only";

import { createServerSupabase } from "@/src/lib/supabase/server";
import type {
  MessageThread,
  ThreadWithMeta,
  ShelterMailboxFilter,
} from "@/src/lib/types/messages";
import { getAdoptionMetaMap } from "../adoptionService";


function buildPreview(body: string, max = 120) {
  const cleaned = body.replace(/\s+/g, " ").trim();
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max)}...`;
}


type LatestMessage = { preview: string | null; readByUser: boolean; readByShelter: boolean };

/** The newest message of each thread: its preview, and whether each side has read it. */
async function getLatestMessageMap(
  threadIds: string[],
): Promise<Map<string, LatestMessage>> {
  if (threadIds.length === 0) return new Map();

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("messages")
    .select("thread_id, body, created_at, read_by_user, read_by_shelter")
    .in("thread_id", threadIds)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const map = new Map<string, LatestMessage>();

  for (const row of data ?? []) {
    const threadId = row.thread_id as string;

    if (!map.has(threadId)) {
      map.set(threadId, {
        preview: buildPreview((row.body as string) ?? ""),
        readByUser: Boolean(row.read_by_user),
        readByShelter: Boolean(row.read_by_shelter),
      });
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

  const [latestMap, adoptionMetaMap] = await Promise.all([
    getLatestMessageMap(threads.map((t) => t.id)),
    getAdoptionMetaMap(adoptionRequestIds),
  ]);

  return threads.map((thread) => ({
    ...thread,
    adoption_status: thread.adoption_request_id
      ? (adoptionMetaMap.get(thread.adoption_request_id)?.status ?? null)
      : null,
    last_message_preview: latestMap.get(thread.id)?.preview ?? null,
    unread: latestMap.has(thread.id) && !latestMap.get(thread.id)!.readByUser,
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

  const latestMap = await getLatestMessageMap(
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
      last_message_preview: latestMap.get(thread.id)?.preview ?? null,
      unread: latestMap.has(thread.id) && !latestMap.get(thread.id)!.readByShelter,
      other_party: null,
    };
  });
}
