import { getMyShelterProfile } from "@/src/lib/services/shelterService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { handle, ok } from "@/src/lib/api";

export const GET = handle(async () => {
  const shelterId = await requireOwnedShelterId();

  return ok(await getMyShelterProfile(shelterId));
});
