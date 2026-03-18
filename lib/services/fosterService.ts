import "server-only";
import { createClientSupabase } from "../supabase/client";
import type { Fosters } from "../types/foster";

const FOSTER_SELECT = `
  id,
  pet_id,
  title,
  description
`;

type FosterRow = {
  id: string | number;
  pet_id: string | number;
  title: string;
  description: string;
};

function normalizeFoster(row: FosterRow): Fosters {
  return {
    id: String(row.id),
    pet_id: String(row.pet_id),
    title: row.title ?? null,
    description: row.description ?? null,
  };
}

export async function getFosterStories(limit = 20): Promise<Fosters[]> {
  const supabase = await createClientSupabase();

  const { data, error } = await supabase
    .from("foster")
    .select(FOSTER_SELECT)
    .order("pet_id", { ascending: true })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map(normalizeFoster);
}
