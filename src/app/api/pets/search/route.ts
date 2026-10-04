import { z } from "zod";
import { ApiError, handle, ok } from "@/src/lib/api";
import { getAvailablePets } from "@/src/lib/services/petService";
import { getSheltersByIds } from "@/src/lib/services/shelterService";
import type { PetFilters, SearchPetCardItem } from "@/src/lib/types/pets";

const SearchPetsSchema = z.object({
  species: z.array(z.enum(["dog", "cat"])).optional(),
  sex: z.array(z.enum(["male", "female"])).optional(),
  age: z
    .array(z.enum(["kitten/puppy", "young_adult", "adult", "senior"]))
    .optional(),
  size: z.array(z.enum(["small", "medium", "large"])).optional(),
  q: z.string().trim().max(60).optional(),
});

export const POST = handle(async (req: Request) => {
  const body = await req.json().catch(() => null);
  const parsed = SearchPetsSchema.safeParse(body);

  if (!parsed.success) throw new ApiError(400, "Invalid pet search filters.");

  const filters: Omit<PetFilters, "status"> = {
    species: parsed.data.species,
    sex: parsed.data.sex,
    age: parsed.data.age,
    size: parsed.data.size,
    q: parsed.data.q,
  };

  const pets = await getAvailablePets(filters);
  const shelterIds = [...new Set(pets.map((pet) => pet.shelter_id))];
  const shelters = await getSheltersByIds(shelterIds);

  const shelterMap = new Map(
    shelters.map((shelter) => [
      shelter.id,
      {
        id: shelter.id,
        shelter_name: shelter.shelter_name,
        logo_url: shelter.logo_url,
      },
    ]),
  );

  const data: SearchPetCardItem[] = pets.map((pet) => ({
    ...pet,
    shelter: shelterMap.get(pet.shelter_id) ?? null,
  }));

  return ok(data);
});
