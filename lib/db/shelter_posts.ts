import { createClient } from "../supabase/client";

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

export async function getShelterPostedVideos(
  shelterId: string,
): Promise<ShelterVideoMini[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pet_media")
    .select(
      `
        id,
        type,
        url,
        caption,
        created_at,
        pets:pet_id (
          id,
          name,
          shelter_id
        )
      `,
    )
    .eq("type", "video")
    .eq("pets.shelter_id", shelterId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    href: `/site/home/${row.id}`, // adjust if your route uses a different id
    imageUrl: row.url ?? null, // fallback if you don't have thumbnails
    thumbnailUrl: null,
    caption: row.caption ?? null,
    title: null,
    petName: row.pets?.name ?? null,
    subtitle: null,
  }));
}

export async function getShelterPostedPets(
  shelterId: string,
): Promise<ShelterPetMini[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pets")
    .select(
      `
        id,
        name,
        sex,
        gender,
        photo_url,
        image_url,
        created_at,
        shelter_id,
        shelters:shelter_id (
          id,
          shelter_name,
          logo_url
        )
      `,
    )
    .eq("shelter_id", shelterId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((p: any) => ({
    id: p.id,
    href: `/site/profiles/pets/${p.id}`,
    imageUrl: p.photo_url ?? p.image_url ?? null,
    name: p.name ?? null,
    petName: p.name ?? null,
    gender: p.gender ?? p.sex ?? "unknown",
    shelterName: p.shelters?.shelter_name ?? null,
    shelterLogo: p.shelters?.logo_url ?? null,
  }));
}
