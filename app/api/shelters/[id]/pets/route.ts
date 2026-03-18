import { NextResponse } from "next/server";
import { getShelterPostedPets } from "@/lib/services/shelterService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const pets = await getShelterPostedPets(id);

    return NextResponse.json(pets, { status: 200 });
  } catch (error) {
    console.error("[GET /api/shelters/[id]/pets]", error);

    return NextResponse.json(
      { message: "Failed to fetch shelter pets" },
      { status: 500 },
    );
  }
}
