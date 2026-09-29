import { NextResponse } from "next/server";
import { getPetPhotosByPetId } from "@/src/lib/services/petMediaService";
import { errorResponse } from "@/src/lib/api";

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
    return errorResponse(error);
  }
}
