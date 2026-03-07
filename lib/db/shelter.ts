import { supabaseServer } from "@/lib/supabase/server";

export type ShelterListItem = {
  id: string;
  shelter_name: string | null;
  logo_url: string | null;
  location: string | null;
  total_available_pets: number;
  total_adopted_pets: number;
};

type ShelterRow = {
  id: string;
  shelter_name: string | null;
  logo_url: string | null;
  location: string | null;
};

type PetRow = {
  shelter_id: string;
  status: string | null;
};

export async function getSheltersWithStats(): Promise<ShelterListItem[]> {
  const supabase = await supabaseServer();

  // 1. fetch shelters
  const { data: shelters, error: sheltersError } = await supabase
    .from("shelter")
    .select(
      `
      id,
      shelter_name,
      logo_url,
      location
    `,
    )
    .order("shelter_name", { ascending: true });

  if (sheltersError) {
    throw new Error(sheltersError.message);
  }

  const shelterRows = (shelters ?? []) as ShelterRow[];

  if (shelterRows.length === 0) {
    return [];
  }

  const shelterIds = shelterRows.map((s) => s.id);

  // 2. fetch pets under those shelters
  const { data: pets, error: petsError } = await supabase
    .from("pets")
    .select("shelter_id, status")
    .in("shelter_id", shelterIds);

  if (petsError) {
    throw new Error(petsError.message);
  }

  const petRows = (pets ?? []) as PetRow[];

  // 3. group counts per shelter
  const statsMap = new Map<
    string,
    { total_available_pets: number; total_adopted_pets: number }
  >();

  for (const shelter of shelterRows) {
    statsMap.set(shelter.id, {
      total_available_pets: 0,
      total_adopted_pets: 0,
    });
  }

  for (const pet of petRows) {
    if (!pet.shelter_id) continue;

    const current = statsMap.get(pet.shelter_id);
    if (!current) continue;

    const status = (pet.status ?? "").trim().toLowerCase();

    if (status === "available") {
      current.total_available_pets += 1;
    }

    if (status === "adopted") {
      current.total_adopted_pets += 1;
    }
  }

  // 4. merge shelters + stats
  return shelterRows.map((shelter) => {
    const stats = statsMap.get(shelter.id) ?? {
      total_available_pets: 0,
      total_adopted_pets: 0,
    };

    return {
      ...shelter,
      total_available_pets: stats.total_available_pets,
      total_adopted_pets: stats.total_adopted_pets,
    };
  });
}
