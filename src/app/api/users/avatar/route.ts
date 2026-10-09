import { uploadMyAvatar } from "@/src/lib/services/usersService";
import { getUserId } from "@/src/lib/utils/auth";
import { ApiError, handle, ok } from "@/src/lib/api";

export const POST = handle(async (req: Request) => {
  const userId = await getUserId();

  if (!userId) throw new ApiError(401, "Unauthorized");

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) throw new ApiError(400, "Missing image file");

  return ok({ url: await uploadMyAvatar(userId, file) }, 201);
});
