import { getLikedStuffByUser } from "@/src/lib/services/likeService";
import { getUserId } from "@/src/lib/utils/auth";
import { ApiError, handle, ok } from "@/src/lib/api";

export const GET = handle(async () => {
  const userId = await getUserId();

  if (!userId) {
    throw new ApiError(401, "You must be logged in to view liked items.");
  }

  return ok(await getLikedStuffByUser(userId));
});
