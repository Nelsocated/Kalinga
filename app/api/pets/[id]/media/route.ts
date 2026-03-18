import { NextResponse } from "next/server";
import { getPetPhotosByPetId } from "@/lib/services/petMediaService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const media = await getPetPhotosByPetId(id);

    return NextResponse.json(media, { status: 200 });
  } catch (error) {
    console.error("[GET /api/pets/[id]/media]", error);

    return NextResponse.json(
      { message: "Failed to fetch pet media" },
      { status: 500 },
    );
  }
}
