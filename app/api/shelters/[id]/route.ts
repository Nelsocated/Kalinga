import { NextResponse } from "next/server";
import { fetchShelterById } from "@/lib/services/shelterService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const shelter = await fetchShelterById(id);

    if (!shelter) {
      return NextResponse.json(
        { message: "Shelter not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(shelter, { status: 200 });
  } catch (error) {
    console.error("[GET /api/shelters/[id]]", error);

    return NextResponse.json(
      { message: "Failed to fetch shelter" },
      { status: 500 },
    );
  }
}
