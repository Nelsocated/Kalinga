import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import type {
  Pets,
  PetFilters,
  PetRow,
  Multi,
  Dashboard,
  CreatePetInput,
} from "@/src/lib/types/pets";

const PET_SELECT = `
  id,
  shelter_id,
  name,
  description,
  breed,
  age,
  status,
  sex,
  species,
  size,
  vaccinated,
  spayed_neutered,
  photo_url,
  year_inShelter,
  created_at
`;

const toArray = <T extends string>(value?: Multi<T>): T[] =>
  Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];

const isAge = (value: unknown): value is Pets["age"] =>
  value === "kitten/puppy" ||
  value === "young_adult" ||
  value === "adult" ||
  value === "senior";

const isStatus = (value: unknown): value is Pets["status"] =>
  value === "available" || value === "pending" || value === "adopted";

const isSex = (value: unknown): value is Pets["sex"] =>
  value === "male" || value === "female";

const isSpecies = (value: unknown): value is Pets["species"] =>
  value === "dog" || value === "cat";

const isSize = (value: unknown): value is Pets["size"] =>
  value === "small" || value === "medium" || value === "large";

function normalizePet(row: PetRow): Pets {
  const currentYear = new Date().getFullYear();

  return {
    id: row.id,
    shelter_id: row.shelter_id ?? "",
    pet_name: row.name ?? "",
    description: row.description ?? "",
    breed: row.breed ?? "",
    age: isAge(row.age) ? row.age : "adult",
    status: isStatus(row.status) ? row.status : "available",
    sex: isSex(row.sex) ? row.sex : "male",
    species: isSpecies(row.species) ? row.species : "dog",
    size: isSize(row.size) ? row.size : "medium",
    vaccinated: Boolean(row.vaccinated),
    spayed_neutered: Boolean(row.spayed_neutered),
    photo_url: row.photo_url ?? "",
    // year_inShelter stores the year the pet arrived; the UI shows years since
    years_inShelter:
      row.year_inShelter == null ? 0 : Math.max(0, currentYear - row.year_inShelter),
    created_at: row.created_at,
  };
}

async function runListQuery(
  query: PromiseLike<{ data: unknown; error: { message: string } | null }>,
): Promise<Pets[]> {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data ?? []) as PetRow[]).map(normalizePet);
}

function applyFilters<T>(query: T, filters: PetFilters = {}): T {
  let nextQuery = query as T & {
    in: (column: string, values: string[]) => T;
    or: (filters: string) => T;
  };

  const species = toArray(filters.species);
  const sex = toArray(filters.sex);
  const age = toArray(filters.age);
  const size = toArray(filters.size);
  const status = toArray(filters.status);

  if (species.length)
    nextQuery = nextQuery.in("species", species) as typeof nextQuery;
  if (sex.length) nextQuery = nextQuery.in("sex", sex) as typeof nextQuery;
  if (age.length) nextQuery = nextQuery.in("age", age) as typeof nextQuery;
  if (size.length) nextQuery = nextQuery.in("size", size) as typeof nextQuery;
  if (status.length)
    nextQuery = nextQuery.in("status", status) as typeof nextQuery;

  // Strip characters that have meaning in PostgREST filter syntax or LIKE patterns
  const q = (filters.q ?? "").replace(/[%_,().*\\"']/g, " ").trim();
  if (q)
    nextQuery = nextQuery.or(
      `name.ilike.%${q}%,breed.ilike.%${q}%`,
    ) as typeof nextQuery;

  return nextQuery;
}

async function getPets(filters: PetFilters = {}): Promise<Pets[]> {
  const supabase = await createServerSupabase();

  const query = supabase
    .from("pets")
    .select(PET_SELECT)
    .order("created_at", { ascending: false });

  return runListQuery(applyFilters(query, filters));
}

export async function getAvailablePets(
  filters: Omit<PetFilters, "status"> = {},
): Promise<Pets[]> {
  return getPets({ ...filters, status: "available" });
}

export async function getPetById(id: string): Promise<Pets | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pets")
    .select(PET_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data ? normalizePet(data) : null;
}

export async function getPetsByIds(ids: string[]): Promise<Pets[]> {
  const uniqueIds = [...new Set(ids)].filter(Boolean);
  if (uniqueIds.length === 0) return [];

  const supabase = await createServerSupabase();

  return runListQuery(
    supabase.from("pets").select(PET_SELECT).in("id", uniqueIds),
  );
}

export async function getPetsByShelter(shelterId: string): Promise<Pets[]> {
  const supabase = await createServerSupabase();

  return runListQuery(
    supabase
      .from("pets")
      .select(PET_SELECT)
      .eq("shelter_id", shelterId)
      .order("created_at", { ascending: false }),
  );
}

export async function getLongestStayPets(limit = 10): Promise<Pets[]> {
  const supabase = await createServerSupabase();
  const cutoffYear = new Date().getFullYear() - 3; // 3+ years in shelter

  return runListQuery(
    supabase
      .from("pets")
      .select(PET_SELECT)
      .not("year_inShelter", "is", null)
      .lte("year_inShelter", cutoffYear)
      .order("year_inShelter", { ascending: true })
      .limit(limit),
  );
}

export async function getPetsByShelterDashboard(
  shelterId: string,
): Promise<Dashboard[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pets")
    .select("id, name, photo_url, species")
    .eq("shelter_id", shelterId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function createPet(
  input: CreatePetInput,
): Promise<{ id: string }> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pets")
    .insert({
      shelter_id: input.shelter_id,
      name: input.name,
      description: input.description ?? null,
      breed: input.breed ?? null,
      species: input.species,
      sex: input.sex,
      age: input.age,
      size: input.size,
      status: input.status ?? "available",
      vaccinated: input.vaccinated ?? false,
      spayed_neutered: input.spayed_neutered ?? false,
      photo_url: input.photo_url ?? null,
      year_inShelter: input.year_inShelter ?? null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return data;
}

/** Throws unless the pet exists and belongs to the given shelter. */
export async function assertShelterOwnsPet(
  shelterId: string,
  petId: string,
): Promise<void> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pets")
    .select("shelter_id")
    .eq("id", petId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new ApiError(404, "Pet not found");
  if (data.shelter_id !== shelterId) {
    throw new ApiError(403, "This pet belongs to another shelter");
  }
}

/** Changes a pet's adoption status. The caller must check the shelter owns the pet. */
export async function setPetStatus(
  petId: string,
  status: Pets["status"],
): Promise<void> {
  const supabase = await createServerSupabase();

  const { error } = await supabase.from("pets").update({ status }).eq("id", petId);

  if (error) throw new Error(error.message);
}
