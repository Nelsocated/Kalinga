import { NextResponse } from "next/server";
import { z } from "zod";

import { getAvailablePets } from "@/lib/services/pet/petService";
import type { PetFilters } from "@/lib/types/pets";
import { getSheltersByIds } from "@/lib/services/shelter/shelterService";
import type { SearchPetCardItem } from "@/lib/types/pets";

const SearchPetsSchema = z.object({
  species: z.array(z.enum(["dog", "cat"])).optional(),
  sex: z.array(z.enum(["male", "female"])).optional(),
  age: z
    .array(z.enum(["kitten/puppy", "young_adult", "adult", "senior"]))
    .optional(),
  size: z.array(z.enum(["small", "medium", "large"])).optional(),
});

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Failed to search pets.";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = SearchPetsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid pet search filters." },
        { status: 400 },
      );
    }

    const filters: Omit<PetFilters, "status"> = {
      species: parsed.data.species,
      sex: parsed.data.sex,
      age: parsed.data.age,
      size: parsed.data.size,
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

    return NextResponse.json({ data });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
