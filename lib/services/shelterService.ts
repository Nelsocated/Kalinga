import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Shelters } from "@/lib/types/shelters";
import { getPetsByShelter } from "./pet/petService";
import { getPetVideosByShelterId } from "./petMediaService";

export type ShelterListItem = {
  id: string;
  shelter_name: string | null;
  logo_url: string | null;
  location: string | null;
  total_available_pets: number;
  total_adopted_pets: number;
};

export type ShelterVideoMini = {
  id: string;
  href?: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  title?: string | null;
  caption?: string | null;
  petName?: string | null;
  subtitle?: string | null;
};

export type ShelterPetMini = {
  id: string;
  href?: string;
  imageUrl?: string | null;
  name?: string | null;
  petName?: string | null;
  gender?: string | null;
  shelterName?: string | null;
  shelterLogo?: string | null;
};

type ShelterRow = {
  id: string;
  shelter_name: string | null;
  logo_url: string | null;
  location: string | null;
};

type PetStatusRow = {
  shelter_id: string;
  status: string | null;
};

export async function fetchShelterById(id: string): Promise<Shelters | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data as Shelters;
}

export async function getSheltersWithStats(): Promise<ShelterListItem[]> {
  const supabase = await createServerSupabase();

  const { data: shelters, error: sheltersError } = await supabase.from(
    "shelter",
  ).select(`
      id,
      shelter_name,
      logo_url,
      location
    `);

  if (sheltersError) throw new Error(sheltersError.message);

  const shelterRows = (shelters ?? []) as ShelterRow[];

  // shuffle
  shelterRows.sort(() => Math.random() - 0.5);

  const shelterIds = shelterRows.map((s) => s.id);

  if (shelterIds.length === 0) {
    return shelterRows.map((shelter) => ({
      ...shelter,
      total_available_pets: 0,
      total_adopted_pets: 0,
    }));
  }

  const { data: pets, error: petsError } = await supabase
    .from("pets")
    .select("shelter_id, status")
    .in("shelter_id", shelterIds);

  if (petsError) throw new Error(petsError.message);

  const petRows = (pets ?? []) as PetStatusRow[];

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
    const current = statsMap.get(pet.shelter_id);
    if (!current) continue;

    const status = (pet.status ?? "").trim().toLowerCase();

    if (status === "available") current.total_available_pets += 1;
    if (status === "adopted") current.total_adopted_pets += 1;
  }

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

export async function getShelterPostedPets(
  shelterId: string,
): Promise<ShelterPetMini[]> {
  const [pets, shelter] = await Promise.all([
    getPetsByShelter(shelterId),
    fetchShelterById(shelterId),
  ]);

  return pets.map((p) => ({
    id: p.id,
    href: `/site/profiles/pet/${p.id}`,
    imageUrl: p.photo_url ?? null,
    name: p.pet_name ?? null,
    petName: p.pet_name ?? null,
    gender: p.sex ?? "unknown",
    shelterName: shelter?.shelter_name ?? null,
    shelterLogo: shelter?.logo_url ?? null,
  }));
}

export async function getShelterPostedVideos(
  shelterId: string,
): Promise<ShelterVideoMini[]> {
  const rows = await getPetVideosByShelterId(shelterId);

  return rows.map((row) => ({
    id: row.id,
    href: `/site/home/${row.id}`,
    imageUrl: row.pets?.photo_url ?? null,
    thumbnailUrl: row.pets?.photo_url ?? null,
    title: row.pets?.name ?? null,
    caption: row.caption ?? null,
    petName: row.pets?.name ?? null,
    subtitle: row.caption ?? null,
  }));
}

export async function getSheltersByIds(
  ids: string[],
): Promise<ShelterListItem[]> {
  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (uniqueIds.length === 0) {
    return [];
  }

  const allShelters = await getSheltersWithStats();

  return allShelters.filter((shelter) => uniqueIds.includes(shelter.id));
}
