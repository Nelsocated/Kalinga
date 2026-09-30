import { createVideo } from "@/src/lib/services/petMediaService";
import { assertShelterOwnsPet } from "@/src/lib/services/petService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { ApiError, handle, ok } from "@/src/lib/api";

export const POST = handle(async (req: Request) => {
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

  return ok(await createVideo({ petId, caption, file }), 201);
});
