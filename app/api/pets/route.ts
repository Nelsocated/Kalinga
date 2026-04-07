import { NextRequest, NextResponse } from "next/server";
import { getPets, createPet } from "@/lib/services/pet/petService";
import type { PetFilters } from "@/lib/types/pets";
import { requireShelter } from "@/lib/utils/auth";
import { getShelterIdByOwnerId } from "@/lib/services/shelter/shelterService";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireShelter();
    const shelterId = await getShelterIdByOwnerId(auth.id);

    if (!shelterId) {
      return NextResponse.json(
        { error: "Shelter profile not found" },
        { status: 404 },
      );
    }

    const body = await req.json();

    const result = await createPet({
      shelter_id: shelterId,
      name: body.name,
      description: body.description,
      breed: body.breed,
      species: body.species,
      sex: body.sex,
      age: body.age,
      size: body.size,
      status: body.status,
      vaccinated: body.vaccinated,
      spayed_neutered: body.spayed_neutered,
      photo_url: body.photo_url,
      years_inShelter: body.years_inShelter,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          details: result.details ?? null,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Pet created successfully",
        data: result.data,
      },
      { status: result.status },
    );
  } catch (error) {
    console.error("[POST /api/pets]", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status:
          message === "Unauthorized"
            ? 401
            : message === "Forbidden"
              ? 403
              : 500,
      },
    );
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
    console.error("GET /api/pets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pets" },
      { status: 500 },
    );
  }
}
