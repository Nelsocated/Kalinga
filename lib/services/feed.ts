import { supabaseServer } from "@/lib/supabase/server";

export async function getFeed(limit = 10) {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.rpc("get_random_feed", {
      limit_count: limit,
    });

    if (error) {
      return [];
    }

    return (data ?? []) as any[];
  } catch {
    return [];
  }
}
