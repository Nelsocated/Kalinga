import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import type {
  Fosters,
  CreateFosterInput,
  FosterItem,
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
    id: row.id,
    pet_id: row.pet_id,
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
