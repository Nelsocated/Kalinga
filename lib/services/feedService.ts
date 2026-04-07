import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";

export type FeedItem = {
  id: string;
  type: string | null;
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

  const { data, error } = await supabase
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
    .eq("pet_media.id", mediaId)
    .eq("pet_media.type", "video")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as FeedItem | null) ?? null;
}

export async function getFeed(
  limit = 10,
  mediaId?: string | null,
): Promise<FeedItem[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.rpc("get_random_feed", {
    limit_count: limit,
  });

  if (error) {
    throw new Error(error.message);
  }

  const randomItems = (data ?? []) as FeedItem[];

  if (!mediaId) {
    return randomItems;
  }

  const targetItem = await getFeedByMediaId(mediaId);

  if (!targetItem) {
    return randomItems;
  }

  const deduped = randomItems.filter((item) => {
    const media = item.pet_media ?? [];
    return !media.some((m) => m.id === mediaId);
  });

  return [targetItem, ...deduped];
}
