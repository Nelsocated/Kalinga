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
};

// 🔥 Get pinned item
async function getFeedByMediaId(mediaId: string): Promise<FeedItem | null> {
  const supabase = await createServerSupabase();

  const { data: media, error: mediaError } = await supabase
    .from("pet_media")
    .select("id, pet_id, type")
    .eq("id", mediaId)
    .eq("type", "video")
    .maybeSingle();

  if (mediaError) throw new Error(mediaError.message);
  if (!media) return null;

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

// 🔥 MAIN FEED
export async function getFeed(mediaId?: string | null): Promise<FeedItem[]> {
  const supabase = await createServerSupabase();

  const targetItem = mediaId ? await getFeedByMediaId(mediaId) : null;

  const { data, error } = await supabase.from("pets").select(`
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
    `);

  if (error) throw new Error(error.message);

  let items = (data ?? []) as FeedItem[];

  // 🔥 randomize
  items = items.sort(() => Math.random() - 0.5);

  // 🔥 move pinned to top
  if (targetItem) {
    items = [targetItem, ...items.filter((i) => i.id !== targetItem.id)];
  }

  return items;
}
