import { z } from "zod";
import { getInitialLikedByUser } from "@/src/lib/services/likeService";
import { getUserId } from "@/src/lib/utils/auth";
import { handle, ok } from "@/src/lib/api";

const LikeTargetSchema = z.object({
  targetType: z.enum(["pet", "shelter", "video"], {
    message: "Invalid targetType or targetId",
  }),
  targetId: z.string().min(1, "Invalid targetType or targetId"),
});

export const GET = handle(async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const target = LikeTargetSchema.parse({
    targetType: searchParams.get("targetType"),
    targetId: searchParams.get("targetId"),
  });

  const userId = await getUserId();

  if (!userId) return ok({ liked: false });

  return ok({ liked: await getInitialLikedByUser({ userId, ...target }) });
});
