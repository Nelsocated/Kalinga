import "server-only";
import { createClientSupabase } from "@/lib/supabase/client";
import type { Pets, PetRow, Multi } from "@/lib/types/pets";

type PetFilters = {
  species?: Multi<Pets["species"]>;
  sex?: Multi<Pets["sex"]>;
  age?: Multi<Pets["age"]>;
  size?: Multi<Pets["size"]>;
  status?: Multi<Pets["status"]>;
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

/** Abstraction */
interface IPetService {
  getPets(filters?: PetFilters): Promise<Pets[]>;
  getPetById(id: string): Promise<Pets | null>;
  getPetsByIds(ids: string[]): Promise<Pets[]>;
  getPetsByShelter(shelterId: string): Promise<Pets[]>;
  getLongestStayPets(limit?: number): Promise<Pets[]>;
  getAvailablePets(filters?: Omit<PetFilters, "status">): Promise<Pets[]>;
  fetchSearchPets(filters?: Omit<PetFilters, "status">): Promise<Pets[]>;
}

/** Abstraction + Inheritance + Polymorphism */
abstract class BaseSupabaseService<TRow, TDomain> {
  protected abstract normalize(row: TRow): TDomain; // polymorphic hook

  protected async getClient() {
    return createClientSupabase();
  }

  protected async runListQuery(
    query: PromiseLike<{
      data: TRow[] | null;
      error: { message: string } | null;
    }>,
  ): Promise<TDomain[]> {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => this.normalize(row));
  }

  protected async runSingleQuery(
    query: PromiseLike<{
      data: TRow | null;
      error: { message: string } | null;
    }>,
  ): Promise<TDomain | null> {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    if (!data) return null;
    return this.normalize(data);
  }
}

/** Encapsulation: query/filter/normalization internals are private/protected */
class PetService
  extends BaseSupabaseService<PetRow, Pets>
  implements IPetService
{
  protected normalize(row: PetRow): Pets {
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

  private applyFilters<T>(query: T, filters: PetFilters = {}): T {
    let nextQuery = query as T & {
      in: (column: string, values: string[]) => T;
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

    return nextQuery;
  }

  async getPets(filters: PetFilters = {}): Promise<Pets[]> {
    const supabase = await this.getClient();

    let query = supabase
      .from("pets")
      .select(PET_SELECT)
      .order("created_at", { ascending: false });

    query = this.applyFilters(query, filters);

    return this.runListQuery(query);
  }

  async getPetById(id: string): Promise<Pets | null> {
    const supabase = await this.getClient();

    const query = supabase
      .from("pets")
      .select(PET_SELECT)
      .eq("id", id)
      .maybeSingle();

    return this.runSingleQuery(query);
  }

  async getPetsByIds(ids: string[]): Promise<Pets[]> {
    const supabase = await this.getClient();
    const uniqueIds = [...new Set(ids)].filter(Boolean);
    if (uniqueIds.length === 0) return [];

    const query = supabase.from("pets").select(PET_SELECT).in("id", uniqueIds);
    return this.runListQuery(query);
  }

  async getPetsByShelter(shelterId: string): Promise<Pets[]> {
    const supabase = await this.getClient();

    const query = supabase
      .from("pets")
      .select(PET_SELECT)
      .eq("shelter_id", shelterId)
      .order("created_at", { ascending: false });

    return this.runListQuery(query);
  }

  async getLongestStayPets(limit = 10): Promise<Pets[]> {
    const supabase = await this.getClient();
    const cutoffYear = new Date().getFullYear() - 3; // 3+ years in shelter

    const query = supabase
      .from("pets")
      .select(PET_SELECT)
      .not("year_inShelter", "is", null)
      .lte("year_inShelter", cutoffYear)
      .order("year_inShelter", { ascending: true })
      .limit(limit);

    return this.runListQuery(query);
  }

  async getAvailablePets(
    filters: Omit<PetFilters, "status"> = {},
  ): Promise<Pets[]> {
    return this.getPets({
      ...filters,
      status: "available",
    });
  }

  async fetchSearchPets(
    filters: Omit<PetFilters, "status"> = {},
  ): Promise<Pets[]> {
    return this.getAvailablePets(filters);
  }
}

const petService = new PetService();

export async function getPets(filters: PetFilters = {}): Promise<Pets[]> {
  return petService.getPets(filters);
}

export async function getPetById(id: string): Promise<Pets | null> {
  return petService.getPetById(id);
}

export async function getPetsByIds(ids: string[]): Promise<Pets[]> {
  return petService.getPetsByIds(ids);
}

export async function getPetsByShelter(shelterId: string): Promise<Pets[]> {
  return petService.getPetsByShelter(shelterId);
}

export async function getLongestStayPets(limit = 10): Promise<Pets[]> {
  return petService.getLongestStayPets(limit);
}

export async function getAvailablePets(
  filters: Omit<PetFilters, "status"> = {},
): Promise<Pets[]> {
  return petService.getAvailablePets(filters);
}

export async function fetchSearchPets(
  filters: Omit<PetFilters, "status"> = {},
): Promise<Pets[]> {
  return petService.fetchSearchPets(filters);
}
