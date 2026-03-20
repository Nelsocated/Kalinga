import { createClient } from "../supabase/client";

export type LongestPet = {
  id: string;
  years_inShelter: number;
  name: string | null;
  sex: "male" | "female" | "unknown";
  photo_url: string | null;
  shelter_name: string | null;
  shelter_logo_url: string | null;
};

export async function getLongestPets(limit = 10): Promise<LongestPet[]> {
  const supabase = await createClient();
  const currentYear = new Date().getFullYear();

  const { data, error } = await supabase
    .from("pets")
    .select(
      `
      id,
      name,
      sex,
      photo_url,
      year_inShelter,
      shelter:shelter_id (
        shelter_name,
        logo_url
      )
    `,
    )
    .not("year_inShelter", "is", null)
    .order("year_inShelter", { ascending: true })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((pet) => {
    const year = Number(pet.year_inShelter);
    const safeYear = Number.isFinite(year) ? year : currentYear;

    const shelterObj = Array.isArray(pet.shelter)
      ? pet.shelter[0]
      : pet.shelter;
    const sexRaw = String(pet.sex ?? "").toLowerCase();
    const sex: "male" | "female" | "unknown" =
      sexRaw === "male" || sexRaw === "female" ? sexRaw : "unknown";

    return {
      id: String(pet.id),
      years_inShelter: Math.max(0, currentYear - safeYear),
      name: pet.name ?? null,
      sex,
      photo_url: pet.photo_url ?? null,
      shelter_name: shelterObj?.shelter_name ?? null,
      shelter_logo_url: shelterObj?.logo_url ?? null,
    };
  });
}
