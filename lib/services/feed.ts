import { supabaseServer } from "@/lib/supabase/server";

export async function getFeed(limit = 10) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("pets")
    .select(
      `
        id, name, description,
        shelter (
          id,
          user:users ( id, username, role, photo_url )
        ),
        pet_media(type, url)
      `,
    )
    .eq("status", "available")
    .eq("pet_media.type", "video")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data;
}
