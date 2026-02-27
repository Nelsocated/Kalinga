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
    .from("shelters")
    .select(
      `
        id,
        shelter_name,
        logo_url,
        location,
        about,
        rating,
        contact_email,
        contact_phone,
        created_at,
        pets (
          id,
          name,
          description,
          created_at,
          status
        )
      `,
    )
    .eq("id", shelterId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProfileShelterOnly(userId: string) {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr) throw authErr;
  if (!user) {
    const e: any = new Error("Unauthorized");
    e.status = 401;
    throw e;
  }

  const { data: shelterRow, error: shelterErr } = await supabase
    .from("shelters")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (shelterErr) throw shelterErr;
  if (!shelterRow) {
    const e: any = new Error("Forbidden: shelter only");
    e.status = 403;
    throw e;
  }

  const { data, error } = await supabase
    .from("user")
    .select(
      "id, username, full_name, photo_url, bio, contact_email, contact_phone, created_at",
    )
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}
