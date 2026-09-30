import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import type {
  Shelters,
  ShelterListItem,
  ShelterPetMini,
  ShelterVideoMini,
  ShelterRow,
  PetStatusRow,
  ShelterUpdatePayload,
  ShelterProfile,
  PetCardProps,
} from "@/src/lib/types/shelters";
import type {
  ShelterProfileUI,
  ShelterPetUI,
} from "@/src/app/shelter/profiles/shelter/ShelterProfileClient";
import { getPetsByShelter } from "./petService";
import { getPetVideosByShelterId } from "./petMediaService";

const SHELTER_LIST_SELECT = "id, shelter_name, logo_url, location";
// Application documents (cert_url, id_url, lease_url) are admin-only
const SHELTER_PUBLIC_SELECT = `
  id,
  owner_id,
  shelter_name,
  logo_url,
  photo_url,
  about,
  location,
  contact_email,
  contact_phone,
  created_at
`;
const AVATAR_BUCKET = "shelter_photos";

export async function fetchShelterById(id: string): Promise<Shelters | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .select(SHELTER_PUBLIC_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data as Shelters | null;
}

/** Adds available/adopted pet counts to each shelter row. */
async function withPetStats(
  shelterRows: ShelterRow[],
): Promise<ShelterListItem[]> {
  const shelterIds = shelterRows.map((s) => s.id);
  const stats = new Map(
    shelterIds.map((id) => [
      id,
      { total_available_pets: 0, total_adopted_pets: 0 },
    ]),
  );

  if (shelterIds.length > 0) {
    const supabase = await createServerSupabase();

    const { data: pets, error } = await supabase
      .from("pets")
      .select("shelter_id, status")
      .in("shelter_id", shelterIds);

    if (error) throw new Error(error.message);

    for (const pet of (pets ?? []) as PetStatusRow[]) {
      const current = stats.get(pet.shelter_id);
      if (!current) continue;

      const status = (pet.status ?? "").trim().toLowerCase();

      if (status === "available") current.total_available_pets += 1;
      if (status === "adopted") current.total_adopted_pets += 1;
    }
  }

  return shelterRows.map((shelter) => ({
    ...shelter,
    ...stats.get(shelter.id)!,
  }));
}

export async function getSheltersWithStats(): Promise<ShelterListItem[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .select(SHELTER_LIST_SELECT);

  if (error) throw new Error(error.message);

  const shelterRows = (data ?? []) as ShelterRow[];
  shelterRows.sort(() => Math.random() - 0.5);

  return withPetStats(shelterRows);
}

export async function getSheltersByIds(
  ids: string[],
): Promise<ShelterListItem[]> {
  const uniqueIds = [...new Set(ids)].filter(Boolean);
  if (uniqueIds.length === 0) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .select(SHELTER_LIST_SELECT)
    .in("id", uniqueIds);

  if (error) throw new Error(error.message);

  return withPetStats((data ?? []) as ShelterRow[]);
}

/** Name, location and logo only; no pet stats. */
export async function getSheltersBasicByIds(ids: string[]): Promise<
  Array<{
    id: string;
    shelter_name: string;
    location: string | null;
    logo_url: string | null;
  }>
> {
  const unique = [...new Set(ids)].filter(Boolean);
  if (!unique.length) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .select("id, shelter_name, location, logo_url")
    .in("id", unique);

  if (error) throw new Error(error.message);

  return data ?? [];
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
    href: `/site/profiles/pets/${p.id}`,
    imageUrl: p.photo_url ?? null,
    petName: p.pet_name ?? null,
    gender: p.sex ?? "unknown",
    shelterName: shelter?.shelter_name ?? null,
    shelterLogo: shelter?.logo_url ?? null,
  }));
}

export async function getShelterPets(
  shelterId: string,
): Promise<PetCardProps[]> {
  const [pets, shelter] = await Promise.all([
    getPetsByShelter(shelterId),
    fetchShelterById(shelterId),
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

export async function getShelterPostedVideos(
  shelterId: string,
): Promise<ShelterVideoMini[]> {
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

export async function getShelterIdByOwnerId(
  ownerId: string,
): Promise<string | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .select("id")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data?.id ?? null;
}

export async function getShelterPetProps(
  ownerId: string,
): Promise<ShelterProfileUI | null> {
  const supabase = await createServerSupabase();

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
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!shelter) return null;

  return {
    id: shelter.id,
    shelter_name: shelter.shelter_name ?? null,
    location: shelter.location ?? null,
    logo_url: shelter.logo_url ?? null,
    about: shelter.about ?? null,
    contact_email: shelter.contact_email ?? null,
    contact_phone: shelter.contact_phone ?? null,
    created_at: shelter.created_at,
    pets: shelter.pets as ShelterPetUI[],
  };
}

export async function getMyShelterProfile(
  shelterId: string,
): Promise<ShelterProfile> {
  const shelter = await fetchShelterById(shelterId);

  if (!shelter) throw new ApiError(404, "Shelter profile not found");

  return shelter as ShelterProfile;
}

export async function updateMyShelterProfile(
  shelterId: string,
  payload: ShelterUpdatePayload,
): Promise<ShelterProfile> {
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

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .update(cleanPayload)
    .eq("id", shelterId)
    .select(SHELTER_PUBLIC_SELECT)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new ApiError(404, "Shelter profile not found");

  return data as ShelterProfile;
}

export async function uploadShelterAvatar(
  ownerId: string,
  file: File,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new ApiError(400, "Please upload an image file.");
  }

  const supabase = await createServerSupabase();
  const filePath = `shelters/${ownerId}-${Date.now()}`;

  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

  return data.publicUrl;
}
