import { supabaseServer } from "@/lib/supabase/server";

export async function getFeed(limit = 10) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc("get_random_feed", {
    limit_count: limit,
  });

  if (error) throw error;

  return (data ?? []) as any[];
}
