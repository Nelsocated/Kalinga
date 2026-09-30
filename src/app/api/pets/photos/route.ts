import {
  getPetPhotosByPetId,
  uploadPetPhoto,
} from "@/src/lib/services/petMediaService";
import { assertShelterOwnsPet } from "@/src/lib/services/petService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { ApiError, handle, ok } from "@/src/lib/api";

export const POST = handle(async (req: Request) => {
  const shelterId = await requireOwnedShelterId();
  const formData = await req.formData();

  const file = formData.get("file");
  const petId = String(formData.get("petId") ?? "").trim();

  if (!(file instanceof File) || !petId) {
    throw new ApiError(400, "Missing file or petId");
  }

  await assertShelterOwnsPet(shelterId, petId);

  const { url } = await uploadPetPhoto({ file, petId });

  return ok({ url });
});

export const GET = handle(async (req: Request) => {
  const petId = new URL(req.url).searchParams.get("petId");

  if (!petId) throw new ApiError(400, "Missing petId");

  const photos = await getPetPhotosByPetId(petId);

  return ok(photos.map((p) => ({ id: p.id, url: p.url })));
});
