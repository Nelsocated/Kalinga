import { NextResponse } from "next/server";
import { ApiError, errorResponse } from "@/src/lib/api";
import { fetchShelterById } from "@/src/lib/services/shelterService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const shelter = await fetchShelterById(id);

    if (!shelter) throw new ApiError(404, "Shelter not found");

    return NextResponse.json(shelter, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
