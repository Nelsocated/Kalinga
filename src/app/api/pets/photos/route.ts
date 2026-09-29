import { NextResponse } from "next/server";
import {
  getPetPhotosByPetId,
  uploadPetPhoto,
} from "@/src/lib/services/petMediaService";
import { assertShelterOwnsPet } from "@/src/lib/services/petService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

export async function POST(req: Request) {
  try {
    const shelterId = await requireOwnedShelterId();
    const formData = await req.formData();

    const file = formData.get("file");
    const petId = String(formData.get("petId") ?? "").trim();

    if (!(file instanceof File) || !petId) {
      throw new ApiError(400, "Missing file or petId");
    }

    await assertShelterOwnsPet(shelterId, petId);

    const { url } = await uploadPetPhoto({ file, petId });

    return NextResponse.json({ success: true, url });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const petId = searchParams.get("petId");

    if (!petId) throw new ApiError(400, "Missing petId");

    const photos = await getPetPhotosByPetId(petId);

    return NextResponse.json({
      photos: photos.map((p) => ({
        id: p.id,
        url: p.url,
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
