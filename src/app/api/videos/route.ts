import { createVideo } from "@/src/lib/services/petMediaService";
import { assertShelterOwnsPet, setPetStatus } from "@/src/lib/services/petService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { ApiError, handle, ok } from "@/src/lib/api";

export const POST = handle(async (req: Request) => {
  const shelterId = await requireOwnedShelterId();
  const formData = await req.formData();

  const petId = String(formData.get("petId") ?? "").trim();
  const caption = String(formData.get("caption") ?? "");
  const file = formData.get("file");
  // "Not available" is stored as pending, the same as foster stories
  const availability = String(formData.get("adoptionStatus") ?? "");
  const status =
    availability === "available" ? "available" : availability === "not_available" ? "pending" : null;

  if (!petId) throw new ApiError(400, "Pet ID is required");
  if (!(file instanceof File)) {
    throw new ApiError(400, "Video file is required");
  }

  await assertShelterOwnsPet(shelterId, petId);

  const video = await createVideo({ petId, caption, file });

  // The video is posted either way; a failed status change isn't fatal
  if (status) {
    await setPetStatus(petId, status).catch((error) =>
      console.error("[POST /api/videos] Failed to update pet status:", error),
    );
  }

  return ok(video, 201);
});
