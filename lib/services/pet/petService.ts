import "server-only";
import { createClientSupabase } from "@/lib/supabase/client";
import type { Pets } from "@/lib/types/pets";

type Multi<T extends string> = T | T[];

export type PetFilters = {
  species?: Multi<Pets["species"]>;
  sex?: Multi<Pets["sex"]>;
  age?: Multi<Pets["age"]>;
  size?: Multi<Pets["size"]>;
  status?: Multi<Pets["status"]>;
};

type PetRow = {
  id: string | null;
  shelter_id: string | null;
  name?: string | null;
  pet_name?: string | null;
  description: string | null;
  breed: string | null;
  age: string | null;
  personality: string | null;
  status: string | null;
  sex: string | null;
  species: string | null;
  size: string | null;
  vaccinated: boolean | null;
  spayed_neutered: boolean | null;
  photo_url: string | null;
  year_inShelter?: number | string | null;
  yearInShelter?: number | string | null;
  year_in_shelter?: number | string | null;
  created_at: string | null;
};

const PET_SELECT = `
  id,
  shelter_id,
  name,
  description,
  breed,
  age,
  personality,
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
  const rawYear = Number(
    row.year_inShelter ?? row.yearInShelter ?? row.year_in_shelter,
  );
  const safeYear = Number.isFinite(rawYear) ? rawYear : currentYear;

  return {
    id: String(row.id ?? ""),
    shelter_id: String(row.shelter_id ?? ""),
    pet_name: String(row.name ?? row.pet_name ?? ""),
    description: String(row.description ?? ""),
    breed: String(row.breed ?? ""),
    age: isAge(row.age) ? row.age : "adult",
    personality: String(row.personality ?? ""),
    status: isStatus(row.status) ? row.status : "available",
    sex: isSex(row.sex) ? row.sex : "male",
    species: isSpecies(row.species) ? row.species : "dog",
    size: isSize(row.size) ? row.size : "medium",
    vaccinated: Boolean(row.vaccinated),
    spayed_neutered: Boolean(row.spayed_neutered),
    photo_url: String(row.photo_url ?? ""),
    years_inShelter: Math.max(0, currentYear - safeYear),
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

function applyPetFilters<T>(query: T, _filters: PetFilters = {}): T {
  let nextQuery = query as T & {
    in: (column: string, values: string[]) => T;
  };

  const species = toArray(_filters.species);
  const sex = toArray(_filters.sex);
  const age = toArray(_filters.age);
  const size = toArray(_filters.size);
  const status = toArray(_filters.status);

  if (species.length)
    nextQuery = nextQuery.in("species", species) as typeof nextQuery;
  if (sex.length) nextQuery = nextQuery.in("sex", sex) as typeof nextQuery;
  if (age.length) nextQuery = nextQuery.in("age", age) as typeof nextQuery;
  if (size.length) nextQuery = nextQuery.in("size", size) as typeof nextQuery;
  if (status.length)
    nextQuery = nextQuery.in("status", status) as typeof nextQuery;

  return nextQuery;
}

async function runPetListQuery(
  query: PromiseLike<{
    data: PetRow[] | null;
    error: { message: string } | null;
  }>,
): Promise<Pets[]> {
  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(normalizePet);
}

export async function getPets(filters: PetFilters = {}): Promise<Pets[]> {
  const supabase = await createClientSupabase();

  let query = supabase
    .from("pets")
    .select(PET_SELECT)
    .order("created_at", { ascending: false });

  query = applyPetFilters(query, filters);

  return runPetListQuery(query);
}

export async function getPetById(id: string): Promise<Pets | null> {
  const supabase = await createClientSupabase();

  const { data, error } = await supabase
    .from("pets")
    .select(PET_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return normalizePet(data as PetRow);
}

export async function getPetsByIds(ids: string[]): Promise<Pets[]> {
  const supabase = await createClientSupabase();

  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (uniqueIds.length === 0) return [];

  const { data, error } = await supabase
    .from("pets")
    .select(PET_SELECT)
    .in("id", uniqueIds);

  if (error) throw new Error(error.message);

  return ((data ?? []) as PetRow[]).map(normalizePet);
}

export async function getPetsByShelter(shelterId: string): Promise<Pets[]> {
  const supabase = await createClientSupabase();

  const query = supabase
    .from("pets")
    .select(PET_SELECT)
    .eq("shelter_id", shelterId)
    .order("created_at", { ascending: false });

  return runPetListQuery(query);
}

export async function getLongestStayPets(limit = 10): Promise<Pets[]> {
  const supabase = await createClientSupabase();

  const query = supabase
    .from("pets")
    .select(PET_SELECT)
    .not("year_inShelter", "is", null)
    .order("year_inShelter", { ascending: true })
    .limit(limit);

  return runPetListQuery(query);
}

export async function getAvailablePets(
  filters: Omit<PetFilters, "status"> = {},
): Promise<Pets[]> {
  return getPets({
    ...filters,
    status: "available",
  });
}

export async function fetchSearchPets(
  filters: Omit<PetFilters, "status"> = {},
): Promise<Pets[]> {
  return getAvailablePets(filters);
}
