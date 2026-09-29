import { NextResponse } from "next/server";
import { createVideo } from "@/src/lib/services/petMediaService";
import { assertShelterOwnsPet } from "@/src/lib/services/petService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

export async function POST(req: Request) {
  try {
    const shelterId = await requireOwnedShelterId();
    const formData = await req.formData();

    const petId = String(formData.get("petId") ?? "").trim();
    const caption = String(formData.get("caption") ?? "");
    const file = formData.get("file");

    if (!petId) throw new ApiError(400, "Pet ID is required");
    if (!(file instanceof File)) {
      throw new ApiError(400, "Video file is required");
    }

    await assertShelterOwnsPet(shelterId, petId);

    const data = await createVideo({ petId, caption, file });

    return NextResponse.json(
      { message: "Video uploaded successfully", data },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
