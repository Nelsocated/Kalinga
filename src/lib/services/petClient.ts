import { fetchJson } from "@/src/lib/fetchJson";
import type { Pets, SearchPetCardItem } from "@/src/lib/types/pets";

export type SearchPetFilters = {
  species?: Pets["species"][];
  sex?: Pets["sex"][];
  age?: Pets["age"][];
  size?: Pets["size"][];
};

export async function fetchSearchPets(
  filters: SearchPetFilters,
): Promise<SearchPetCardItem[]> {
  const json = await fetchJson<{ data?: SearchPetCardItem[] }>(
    "/api/pets/search",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    },
  );

  return json.data ?? [];
}
