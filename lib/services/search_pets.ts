export type SearchPetsParams = {
  species?: string | string[];
  sex?: string | string[];
  age?: string | string[];
  size?: string | string[];
};

const toCsv = (v?: string | string[]) =>
  Array.isArray(v) ? v.filter(Boolean).join(",") : (v ?? "");

export async function fetchSearchPets(filters: SearchPetsParams) {
  const params = new URLSearchParams();

  const species = toCsv(filters.species);
  const sex = toCsv(filters.sex);
  const age = toCsv(filters.age);
  const size = toCsv(filters.size);

  if (species) params.set("species", species);
  if (sex) params.set("sex", sex);
  if (age) params.set("age", age);
  if (size) params.set("size", size);

  const qs = params.toString();
  const url = qs ? `/api/search?${qs}` : "/api/search";

  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) throw new Error(json?.error ?? "Search failed");

  return json?.data ?? [];
}
