import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";

export type FeedItem = {
  pet_id: string;
  media_id: string;
  url: string;
  caption: string | null;
  created_at: string | null;
  name: string;
  shelter: {
    id: string;
    shelter_name: string | null;
    logo_url?: string | null;
  } | null;
};

export async function getFeed(mediaId?: string | null): Promise<FeedItem[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.rpc("get_feed", {
    pinned_media_id: mediaId ?? undefined,
  });

  if (error) throw new Error(error.message);

  const items = (data ?? []) as FeedItem[];

  // The RPC shuffles the feed without keeping the pinned video first,
  // so a shared link would open on a random video
  const pinned = mediaId ? items.findIndex((item) => item.media_id === mediaId) : -1;
  if (pinned > 0) items.unshift(...items.splice(pinned, 1));

  return items;
}
