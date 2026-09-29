import { NextResponse } from "next/server";
import { getPetById } from "@/src/lib/services/petService";
import { ApiError, errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const pet = await getPetById(id);

    if (!pet) throw new ApiError(404, "Pet not found");

    return NextResponse.json(pet, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
