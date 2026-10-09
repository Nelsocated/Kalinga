import { z } from "zod";
import { ApiError, handle, ok } from "@/src/lib/api";
import { getAvailablePets } from "@/src/lib/services/petService";
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

  const data: SearchPetCardItem[] = await getAvailablePets(filters);

  return ok(data);
});
