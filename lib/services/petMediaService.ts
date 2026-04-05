import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  Pet_Media,
  VideoWithPet,
  VideoWithShelterPet,
  VideoRow,
} from "@/lib/types/petMedia";

class PetMediaService {
  private supabase: Awaited<ReturnType<typeof createServerSupabase>> | null =
    null;

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createServerSupabase();
    }
    return this.supabase;
  }

  async getPetPhotosByPetId(petId: string): Promise<Pet_Media[]> {
    const supabase = await this.getSupabase();

    const { data, error } = await supabase
      .from("pet_media")
      .select("*")
      .eq("pet_id", petId)
      .eq("type", "photo")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []) as Pet_Media[];
  }

  async getVideosByPetIds(petIds: string[]): Promise<VideoWithPet[]> {
    const supabase = await this.getSupabase();

    const uniqueIds = [...new Set(petIds)].filter(Boolean);

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
      .in("pet_id", uniqueIds)
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
      pet: Array.isArray(row.pets) ? (row.pets[0] ?? null) : row.pets,
    }));
  }

  async getPetVideosByShelterId(
    shelterId: string,
  ): Promise<VideoWithShelterPet[]> {
    const supabase = await this.getSupabase();

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
    pets!inner (
      id,
      name,
      photo_url,
      shelter_id
    )
  `,
      )
      .eq("type", "video")
      .eq("pets.shelter_id", shelterId) // now this actually filters
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
}

export const petMediaService = new PetMediaService();

export async function getPetPhotosByPetId(petId: string): Promise<Pet_Media[]> {
  return petMediaService.getPetPhotosByPetId(petId);
}

export async function getVideosByPetIds(
  petIds: string[],
): Promise<VideoWithPet[]> {
  return petMediaService.getVideosByPetIds(petIds);
}

export async function getPetVideosByShelterId(
  shelterId: string,
): Promise<VideoWithShelterPet[]> {
  return petMediaService.getPetVideosByShelterId(shelterId);
}
