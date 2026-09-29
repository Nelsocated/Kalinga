import { NextResponse } from "next/server";
import { errorResponse } from "@/src/lib/api";
import { getShelterPostedPets } from "@/src/lib/services/shelterService";

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
    return errorResponse(error);
  }
}
