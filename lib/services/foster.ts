import { createClient } from "../supabase/client";

export type FosterStory = {
  id: string; // foster row id
  pet_id: string; // pets.id
  title: string | null;
  description: string | null;
  pet_name: string | null;
  pet_sex: "male" | "female" | "unknown";
  pet_photo_url: string | null;
  shelter_name: string | null;
  shelter_logo_url: string | null;
};

export async function getFosterStories(limit = 20): Promise<FosterStory[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("foster")
    .select(
      `
      id,
      pet_id,
      title,
      description,
      pet:pet_id (
        id,
        name,
        sex,
        photo_url,
        shelter:shelter_id (
          shelter_name,
          logo_url
        )
      )
    `,
    )
    .order("pet_id", { ascending: true })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row: any) => {
    const petObj = Array.isArray(row.pet) ? row.pet[0] : row.pet;
    const shelterObj = Array.isArray(petObj?.shelter)
      ? petObj?.shelter[0]
      : petObj?.shelter;

    const sexRaw = String(petObj?.sex ?? "").toLowerCase();
    const pet_sex: "male" | "female" | "unknown" =
      sexRaw === "male" || sexRaw === "female" ? sexRaw : "unknown";

    return {
      id: String(row.id),
      pet_id: String(row.pet_id),
      title: row.title ?? null,
      description: row.description ?? null,
      pet_name: petObj?.name ?? null,
      pet_sex,
      pet_photo_url: petObj?.photo_url ?? null,
      shelter_name: shelterObj?.shelter_name ?? null,
      shelter_logo_url: shelterObj?.logo_url ?? null,
    };
  });
}
