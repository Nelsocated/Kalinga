import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import type {
  Shelters,
  ShelterListItem,
  ShelterPetMini,
  ShelterVideoMini,
  ShelterRow,
  PetStatusRow,
  ShelterUpdatePayload,
  ShelterServiceResult,
  ShelterProfile,
  PetCardProps,
} from "@/src/lib/types/shelters";
import type {
  ShelterProfileUI,
  ShelterPetUI,
} from "@/src/app/shelter/profiles/shelter/ShelterProfileClient";
import { getPetsByShelter } from "../pet/petService";
import { getPetVideosByShelterId } from "../petMediaService";

type UploadShelterAvatarResult =
  | { ok: true; data: string; status: number }
  | { ok: false; error: string; status: number };

class ShelterService {
  private supabase: Awaited<ReturnType<typeof createServerSupabase>> | null =
    null;

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createServerSupabase();
    }
    return this.supabase;
  }

  async fetchShelterById(id: string): Promise<Shelters | null> {
    const supabase = await this.getSupabase();

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

  async getSheltersWithStats(): Promise<ShelterListItem[]> {
    const supabase = await this.getSupabase();

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

  async getShelterPostedPets(shelterId: string): Promise<ShelterPetMini[]> {
    const [pets, shelter] = await Promise.all([
      getPetsByShelter(shelterId),
      this.fetchShelterById(shelterId),
    ]);

    return pets.map((p) => ({
      id: p.id,
      href: `/site/profiles/pet/${p.id}`,
      imageUrl: p.photo_url ?? null,
      petName: p.pet_name ?? null,
      gender: p.sex ?? "unknown",
      shelterName: shelter?.shelter_name ?? null,
      shelterLogo: shelter?.logo_url ?? null,
    }));
  }

  async getShelterPets(shelterId: string): Promise<PetCardProps[]> {
    const [pets, shelter] = await Promise.all([
      getPetsByShelter(shelterId),
      this.fetchShelterById(shelterId),
    ]);

    return pets.map((p) => ({
      id: p.id,
      imageUrl: p.photo_url ?? null,
      petName: p.pet_name ?? null,
      gender: p.sex ?? "unknown",
      shelterName: shelter?.shelter_name ?? null,
      shelterLogo: shelter?.logo_url ?? null,
      breed: p.breed,
      age: p.age,
      sex: p.sex,
      species: p.species,
      size: p.size,
    }));
  }

  async getShelterPostedVideos(shelterId: string): Promise<ShelterVideoMini[]> {
    const rows = await getPetVideosByShelterId(shelterId);

    return rows.map((row) => ({
      id: row.id,
      href: `/site/home/pet/${row.id}`,
      imageUrl: row.pets?.photo_url ?? null,
      thumbnailUrl: row.pets?.photo_url ?? null,
      title: row.pets?.name ?? null,
      caption: row.caption ?? null,
      petId: row.pet_id ?? null,
      petName: row.pets?.name ?? null,
      subtitle: row.caption ?? null,
    }));
  }

  async getSheltersByIds(ids: string[]): Promise<ShelterListItem[]> {
    const uniqueIds = [...new Set(ids)].filter(Boolean);

    if (uniqueIds.length === 0) {
      return [];
    }

    const allShelters = await this.getSheltersWithStats();

    return allShelters.filter((shelter) => uniqueIds.includes(shelter.id));
  }

  async getShelterIdByOwnerId(ownerId: string): Promise<string | null> {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("shelter")
      .select("id")
      .eq("owner_id", ownerId) // ← was user_id
      .single();

    if (error) return null;
    return data?.id ?? null;
  }

  async getShelterPetProps(id: string): Promise<ShelterProfileUI | null> {
    const supabase = await this.getSupabase();

    const { data: shelter, error } = await supabase
      .from("shelter")
      .select(
        `
          id,
          shelter_name,
          location,
          logo_url,
          about,
          contact_email,
          contact_phone,
          created_at,
          pets (
            id,
            name,
            sex,
            photo_url
          )
        `,
      )
      .eq("owner_id", id)
      .single();

    if (error) {
      console.error("[getShelterPetProps]", error);
      return null;
    }

    if (!shelter) return null;

    return {
      id: shelter.id,
      shelter_name: shelter.shelter_name ?? null,
      location: shelter.location ?? null, // note: typo in your type "lcoation"
      logo_url: shelter.logo_url ?? null,
      about: shelter.about ?? null,
      contact_email: shelter.contact_email ?? null,
      contact_phone: shelter.contact_phone ?? null,
      created_at: shelter.created_at,
      pets: shelter.pets as ShelterPetUI[],
    };
  }

  async getMyShelterProfile(): Promise<ShelterServiceResult> {
    const supabase = await this.getSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        ok: false,
        error: "Unauthorized",
        details: authError?.message ?? null,
        status: 401,
      };
    }

    const { data, error } = await supabase
      .from("shelter")
      .select("*")
      .eq("owner_id", user.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      return {
        ok: false,
        error: "Failed to fetch shelter profile",
        details: error.message,
        status: 400,
      };
    }

    if (!data) {
      return {
        ok: false,
        error: "Shelter profile not found",
        details: `No shelter row found for owner_id ${user.id}`,
        status: 404,
      };
    }

    return {
      ok: true,
      data,
      status: 200,
    };
  }

  async updateMyShelterProfile(
    payload: ShelterUpdatePayload,
  ): Promise<ShelterServiceResult> {
    const supabase = await this.getSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        ok: false,
        error: "Unauthorized",
        details: authError?.message ?? null,
        status: 401,
      };
    }

    const cleanPayload = Object.fromEntries(
      Object.entries({
        shelter_name: payload.shelter_name?.trim() || undefined,
        logo_url: payload.logo_url?.trim() || undefined,
        about: payload.about?.trim() || undefined,
        location: payload.location?.trim() || undefined,
        contact_email: payload.contact_email?.trim() || undefined,
        contact_phone: payload.contact_phone?.trim() || undefined,
      }).filter(([, v]) => v !== undefined),
    ) as ShelterUpdatePayload;

    // Fetch existing shelter by owner_id
    const { data: existing, error: existingError } = await supabase
      .from("shelter")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1)
      .maybeSingle();

    if (existingError) {
      return {
        ok: false,
        error: "Failed to check shelter profile",
        details: existingError.message,
        status: 400,
      };
    }

    // Insert if no row exists
    if (!existing) {
      const { data, error } = await supabase
        .from("shelter")
        .insert({
          owner_id: user.id,
          shelter_name: cleanPayload.shelter_name ?? "",
          ...cleanPayload,
        })
        .select("*")
        .maybeSingle();

      if (error) {
        return {
          ok: false,
          error: "Failed to create shelter profile",
          details: error.message,
          status: 400,
        };
      }

      return { ok: true, data, status: 200 };
    }

    // Update using the shelter's own id — guaranteed single row
    const { error: updateError } = await supabase
      .from("shelter")
      .update(cleanPayload)
      .eq("id", existing.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return {
        ok: false,
        error: "Failed to update shelter profile",
        details: updateError.message,
        status: 400,
      };
    }

    const { data, error: fetchError } = await supabase
      .from("shelter")
      .select("*")
      .eq("id", existing.id)
      .maybeSingle();

    if (fetchError || !data) {
      return {
        ok: false,
        error: "Failed to fetch updated shelter",
        details: fetchError?.message ?? null,
        status: 400,
      };
    }

    return { ok: true, data: data as ShelterProfile, status: 200 };
  }

  async uploadShelterAvatar(file: File): Promise<UploadShelterAvatarResult> {
    const supabase = await this.getSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        ok: false,
        error: "Unauthorized",
        status: 401,
      };
    }

    const filePath = `shelters/${user.id}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("shelter_photos")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      return {
        ok: false,
        error: error.message,
        status: 400,
      };
    }

    const { data } = supabase.storage
      .from("shelter_photos")
      .getPublicUrl(filePath);

    return {
      ok: true,
      data: data.publicUrl,
      status: 200,
    };
  }
}

export const shelterService = new ShelterService();

// Backward-compatible exports
export async function fetchShelterById(id: string): Promise<Shelters | null> {
  return shelterService.fetchShelterById(id);
}

export async function getSheltersWithStats(): Promise<ShelterListItem[]> {
  return shelterService.getSheltersWithStats();
}

export async function getShelterPostedPets(
  shelterId: string,
): Promise<ShelterPetMini[]> {
  return shelterService.getShelterPostedPets(shelterId);
}

export async function getShelterPostedVideos(
  shelterId: string,
): Promise<ShelterVideoMini[]> {
  return shelterService.getShelterPostedVideos(shelterId);
}

export async function getSheltersByIds(
  ids: string[],
): Promise<ShelterListItem[]> {
  return shelterService.getSheltersByIds(ids);
}

export async function getShelterIdByOwnerId(
  ownerId: string,
): Promise<string | null> {
  return shelterService.getShelterIdByOwnerId(ownerId);
}

export async function getMyShelterProfile(): Promise<ShelterServiceResult> {
  return shelterService.getMyShelterProfile();
}

export async function updateMyShelterProfile(
  payload: ShelterUpdatePayload,
): Promise<ShelterServiceResult> {
  return shelterService.updateMyShelterProfile(payload);
}

export async function uploadShelterAvatar(
  file: File,
): Promise<UploadShelterAvatarResult> {
  return shelterService.uploadShelterAvatar(file);
}

export async function getShelterPetProps(
  id: string,
): Promise<ShelterProfileUI | null> {
  return shelterService.getShelterPetProps(id);
}

export async function getShelterPets(
  shelterId: string,
): Promise<PetCardProps[]> {
  return shelterService.getShelterPets(shelterId);
}
