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

export async function getFeed(mediaId?: string | null): Promise<FeedItem[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.rpc("get_feed", {
    pinned_media_id: mediaId ?? null,
  });

  if (error) throw new Error(error.message);

  return (data ?? []) as FeedItem[];
}
