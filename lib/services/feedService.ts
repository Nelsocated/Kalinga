import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";

export type FeedItem = {
  id: string;
  type: string | null;
  created_at: string | null;
  [key: string]: unknown;
};

export async function getFeed(limit = 10): Promise<FeedItem[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.rpc("get_random_feed", {
    limit_count: limit,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as FeedItem[];
}
