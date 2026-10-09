import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { createPublicSupabase } from "@/src/lib/supabase/public";
import { CACHE_TAGS, PUBLIC_LIST_SECONDS, invalidate } from "@/src/lib/cache";
import type { CreateFosterInput, FosterItem } from "@/src/lib/types/foster";

const FOSTER_SELECT = `
  id,
  pet_id,
  title,
  description,
  created_at
`;

/** The newest stories, each with its pet and the pet's shelter, in one query. Cached like the pet lists. */
export const getFosterStories = unstable_cache(
  async (limit = 20) => {
    const supabase = createPublicSupabase();

    const { data, error } = await supabase
      .from("foster")
      .select(
        "id, pet_id, title, description, pets ( name, sex, photo_url, shelter ( shelter_name, logo_url, location ) )",
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return data ?? [];
  },
  ["foster-stories"],
  {
    revalidate: PUBLIC_LIST_SECONDS,
    tags: [CACHE_TAGS.fosters, CACHE_TAGS.pets, CACHE_TAGS.shelters],
  },
);

/** One story with its pet and the pet's shelter, or null when it doesn't exist. Cached like the list. */
export const getFosterStoryById = unstable_cache(
  async (id: string) => {
    const supabase = createPublicSupabase();

    const { data, error } = await supabase
      .from("foster")
      .select(
        "id, pet_id, title, description, created_at, pets ( name, sex, photo_url, shelter ( id, shelter_name, logo_url, location ) )",
      )
      .eq("id", id)
      .maybeSingle();

    // A malformed id is a missing story, not a server error
    if (error) {
      if (error.code === "22P02") return null;
      throw new Error(error.message);
    }

    return data;
  },
  ["foster-story"],
  {
    revalidate: PUBLIC_LIST_SECONDS,
    tags: [CACHE_TAGS.fosters, CACHE_TAGS.pets, CACHE_TAGS.shelters],
  },
);

export async function createFoster(
  input: CreateFosterInput,
): Promise<FosterItem> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("foster")
    .insert({
      pet_id: input.petId,
      title: input.title.trim(),
      description: input.description.trim(),
    })
    .select(FOSTER_SELECT)
    .single();

  if (error) throw new Error(error.message);

  if (input.adoptionStatus) {
    const { error: updateError } = await supabase
      .from("pets")
      .update({ status: input.adoptionStatus })
      .eq("id", input.petId);

    // The story is saved either way; a failed status change isn't fatal
    if (updateError) {
      console.error("[createFoster] Failed to update pet status:", updateError);
    }
  }

  invalidate(CACHE_TAGS.fosters, CACHE_TAGS.pets);
  return data;
}
