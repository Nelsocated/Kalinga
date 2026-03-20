import { supabaseServer } from "@/lib/supabase/server";

export type PetSearchFilters = {
  species?: string[] | null;
  sex?: string[] | null;
  age?: string[] | null;
  size?: string[] | null;
};

const clean = (arr?: string[] | null) =>
  (arr ?? []).map((v) => v.trim()).filter(Boolean);

export async function searchPets(filters: PetSearchFilters) {
  const supabase = await supabaseServer();

  let query = supabase
    .from("pets")
    .select(
      `
      id,
      name,
      breed,
      sex,
      species,
      age,
      size,
      photo_url,
      shelter:shelter_id (
        id,
        shelter_name,
        logo_url
      )
    `,
    )
    .eq("status", "available");

  const species = clean(filters.species);
  const sex = clean(filters.sex);
  const age = clean(filters.age);
  const size = clean(filters.size);

  if (species.length) query = query.in("species", species);
  if (sex.length) query = query.in("sex", sex);
  if (age.length) query = query.in("age", age);
  if (size.length) query = query.in("size", size);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
