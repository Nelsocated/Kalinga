import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";

export type FeedItem = {
  id: string;
  name: string;
  created_at: string | null;
  shelter?: {
    id: string;
    shelter_name: string | null;
    logo_url?: string | null;
  } | null;
  pet_media?: Array<{
    id: string;
    type: string | null;
    url?: string | null;
    caption?: string | null;
    created_at?: string | null;
  }> | null;
  [key: string]: unknown;
};

async function getFeedByMediaId(mediaId: string): Promise<FeedItem | null> {
  const supabase = await createServerSupabase();

  // 1. Get the media row
  const { data: media, error: mediaError } = await supabase
    .from("pet_media")
    .select("id, pet_id, type, url, caption, created_at")
    .eq("id", mediaId)
    .eq("type", "video")
    .maybeSingle();

  if (mediaError) throw new Error(mediaError.message);
  if (!media) return null;

  // 2. Fetch the parent pet
  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select(
      `
      *,
      shelter:shelter (
        id,
        shelter_name,
        logo_url
      ),
      pet_media (
        id,
        type,
        url,
        caption,
        created_at
      )
    `,
    )
    .eq("id", media.pet_id)
    .maybeSingle();

  if (petError) throw new Error(petError.message);

  return (pet as FeedItem | null) ?? null;
}
export async function getFeed(
  limit = 10,
  excludedIds: string[] = [],
  mediaId?: string | null,
): Promise<FeedItem[]> {
  const supabase = await createServerSupabase();

  // Fetch the pinned item first so we know its pet ID to exclude
  const targetItem = mediaId ? await getFeedByMediaId(mediaId) : null;

  // Exclude already-seen IDs + the pinned pet so it doesn't appear twice
  const allExcluded = targetItem
    ? [...excludedIds, targetItem.id]
    : excludedIds;

  const { data, error } = await supabase.rpc("get_random_feed", {
    limit_count: targetItem ? limit - 1 : limit, // save one slot for pinned
    excluded_ids: allExcluded,
  });

  if (error) throw new Error(error.message);

  const randomItems = (data ?? []) as FeedItem[];

  return targetItem ? [targetItem, ...randomItems] : randomItems;
}
