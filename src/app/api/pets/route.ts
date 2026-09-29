import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPets, createPet } from "@/src/lib/services/petService";
import type { PetFilters } from "@/src/lib/types/pets";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

const CreatePetSchema = z.object({
  name: z.string().trim().min(1, "Pet name is required."),
  description: z.string().trim().nullish(),
  breed: z.string().trim().nullish(),
  species: z.enum(["dog", "cat"]),
  sex: z.enum(["male", "female"]),
  age: z.enum(["kitten/puppy", "young_adult", "adult", "senior"]),
  size: z.enum(["small", "medium", "large"]),
  status: z.enum(["available", "pending", "adopted"]).optional(),
  vaccinated: z.boolean().optional(),
  spayed_neutered: z.boolean().optional(),
  photo_url: z.string().nullish(),
  // The add-pet form sends the year the pet arrived as text, e.g. "2021"
  year_inShelter: z.coerce
    .number()
    .int()
    .min(1980, "Year in shelter must be a year, e.g. 2021.")
    .max(new Date().getFullYear(), "Year in shelter can't be in the future."),
});

export async function POST(req: NextRequest) {
  try {
    const shelterId = await requireOwnedShelterId();
    const input = CreatePetSchema.parse(await req.json());

    const data = await createPet({ ...input, shelter_id: shelterId });

    return NextResponse.json(
      { message: "Pet created successfully", data },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const getMulti = (key: string) => {
      const values = searchParams.getAll(key).filter(Boolean);
      if (values.length === 0) return undefined;
      return values.length === 1 ? values[0] : values;
    };

    const filters: PetFilters = {
      species: getMulti("species") as PetFilters["species"],
      sex: getMulti("sex") as PetFilters["sex"],
      age: getMulti("age") as PetFilters["age"],
      size: getMulti("size") as PetFilters["size"],
      status: getMulti("status") as PetFilters["status"],
    };

    const pets = await getPets(filters);

    return NextResponse.json(pets, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
