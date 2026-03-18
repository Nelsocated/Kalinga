import "server-only";
import { createClientSupabase } from "../supabase/client";
import type { Pet_Media } from "@/lib/types/petMedia";

type PetMini = {
  id: string;
  name: string | null;
  photo_url: string | null;
};

type VideoWithPet = {
  id: string;
  pet_id: string;
  type: "photo" | "video";
  url: string | null;
  caption: string | null;
  created_at: string;
  pet: PetMini | null;
};

type VideoWithShelterPet = {
  id: string;
  pet_id: string;
  type: "photo" | "video";
  url: string | null;
  caption: string | null;
  created_at: string;
  pets: PetMini | null;
};

type VideoRow = {
  id: string;
  pet_id: string;
  type: "photo" | "video";
  url: string | null;
  caption: string | null;
  created_at: string;
  pets: PetMini | PetMini[] | null;
};

export async function getPetPhotosByPetId(petId: string): Promise<Pet_Media[]> {
  const supabase = await createClientSupabase();

  const { data, error } = await supabase
    .from("pet_media")
    .select("*")
    .eq("pet_id", petId)
    .eq("type", "photo")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as Pet_Media[];
}

export async function getVideosByIds(ids: string[]): Promise<VideoWithPet[]> {
  const supabase = await createClientSupabase();

  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (uniqueIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("pet_media")
    .select(
      `
      id,
      pet_id,
      type,
      url,
      caption,
      created_at,
      pets:pet_id (
        id,
        name,
        photo_url
      )
    `,
    )
    .eq("type", "video")
    .in("id", uniqueIds);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as VideoRow[];

  return rows.map((row) => ({
    id: row.id,
    pet_id: row.pet_id,
    type: row.type,
    url: row.url,
    caption: row.caption,
    created_at: row.created_at,
    pet: Array.isArray(row.pets) ? (row.pets[0] ?? null) : row.pets,
  }));
}

export async function getPetVideosByShelterId(
  shelterId: string,
): Promise<VideoWithShelterPet[]> {
  const supabase = await createClientSupabase();

  const { data, error } = await supabase
    .from("pet_media")
    .select(
      `
      id,
      pet_id,
      type,
      url,
      caption,
      created_at,
      pets:pet_id (
        id,
        name,
        photo_url
      )
    `,
    )
    .eq("type", "video")
    .eq("pets.shelter_id", shelterId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as VideoRow[];

  return rows.map((row) => ({
    id: row.id,
    pet_id: row.pet_id,
    type: row.type,
    url: row.url,
    caption: row.caption,
    created_at: row.created_at,
    pets: Array.isArray(row.pets) ? (row.pets[0] ?? null) : row.pets,
  }));
}
