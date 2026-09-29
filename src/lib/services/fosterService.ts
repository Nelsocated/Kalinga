import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import type {
  Fosters,
  CreateFosterInput,
  FosterItem,
  UpdateFosterInput,
  FosterRow,
} from "@/src/lib/types/foster";

const FOSTER_SELECT = `
  id,
  pet_id,
  title,
  description,
  created_at
`;

function normalizeFoster(row: FosterRow): Fosters {
  return {
    id: String(row.id),
    pet_id: String(row.pet_id),
    title: row.title ?? "",
    description: row.description ?? "",
    created_at: row.created_at ?? undefined,
  };
}

export async function getAll(limit = 20): Promise<Fosters[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("foster")
    .select(FOSTER_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map(normalizeFoster);
}

export async function getFosterStories(): Promise<FosterItem[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("foster")
    .select(FOSTER_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function getFosterStoryById(id: string): Promise<FosterItem> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("foster")
    .select(FOSTER_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new ApiError(404, "Foster story not found");

  return data;
}

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

  return data;
}

export async function updateFoster(
  input: UpdateFosterInput,
): Promise<FosterItem> {
  const supabase = await createServerSupabase();

  const payload: { title?: string; description?: string } = {};

  if (input.title !== undefined) payload.title = input.title.trim();
  if (input.description !== undefined) {
    payload.description = input.description.trim();
  }

  const { data, error } = await supabase
    .from("foster")
    .update(payload)
    .eq("id", input.id)
    .select(FOSTER_SELECT)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new ApiError(404, "Foster story not found");

  return data;
}

export async function deleteFoster(id: string): Promise<{ id: string }> {
  const supabase = await createServerSupabase();

  const { error } = await supabase.from("foster").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return { id };
}
