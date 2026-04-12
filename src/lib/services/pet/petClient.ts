import type { Pets } from "@/src/lib/types/pets";
import type { SearchPetCardItem } from "@/src/lib/types/pets";

export type SearchPetFilters = {
  species?: Pets["species"][];
  sex?: Pets["sex"][];
  age?: Pets["age"][];
  size?: Pets["size"][];
};

type SearchPetsResponse = {
  data?: SearchPetCardItem[];
  error?: string;
};

export async function fetchSearchPets(
  filters: SearchPetFilters,
): Promise<SearchPetCardItem[]> {
  const res = await fetch("/api/pets/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });

  const json = (await res
    .json()
    .catch(() => null)) as SearchPetsResponse | null;

  if (!res.ok) {
    throw new Error(json?.error ?? "Failed to search pets.");
  }

  return json?.data ?? [];
}
