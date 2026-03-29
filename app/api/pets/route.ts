import { NextRequest, NextResponse } from "next/server";
import { getPets } from "@/lib/services/pet/petService";
import type { PetFilters } from "@/lib/types/pets";

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
