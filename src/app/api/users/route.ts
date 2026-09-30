import { getMyUser } from "@/src/lib/services/usersService";
import { getUserId } from "@/src/lib/utils/auth";
import { ApiError, handle, ok } from "@/src/lib/api";

export const GET = handle(async () => {
  const userId = await getUserId();

  if (!userId) throw new ApiError(401, "Unauthorized");

  return ok(await getMyUser(userId));
});
