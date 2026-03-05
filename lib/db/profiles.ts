// lib/db/profiles.ts
import { supabaseServer } from "@/lib/supabase/server";

export async function getPetProfile(petId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("pets")
    .select(
      `
      id,
      name,
      description,
      breed,
      age,
      personality,
      species,
      sex,
      size,
      vaccinated,
      spayed_neutered,
      photo_url,
      status,
      created_at,
      shelter:shelter_id (
        id,
        shelter_name,
        logo_url,
        location
      ),
      pet_media (
        id,
        type,
        url,
        caption,
        created_at
      )
    `,
    )
    .eq("id", petId)
    .single();

  if (error) throw error;
  return data;
}

export async function getShelterProfile(shelterId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("shelter")
    .select(
      `
        id,
        shelter_name,
        logo_url,
        location,
        about,
        contact_email,
        contact_phone,
        created_at,
        pets (
          id,
          name,
          sex,
          photo_url,
          created_at
        )
      `,
    )
    .eq("id", shelterId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProfileById(userId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("users")
    .select(
      "id, username, full_name, photo_url, bio, contact_email, contact_phone, created_at",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
