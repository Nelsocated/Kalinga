import { NextResponse } from "next/server";
import { getPetById } from "@/lib/services/pet/petService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const pet = await getPetById(id);

    if (!pet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json(pet, { status: 200 });
  } catch (error) {
    console.error("[GET /api/pets/[id]]", error);

    return NextResponse.json(
      { message: "Failed to fetch pet" },
      { status: 500 },
    );
  }
}
