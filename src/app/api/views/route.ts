import { z } from "zod";
import {
  getStatsByMediaId,
  recordView,
} from "@/src/lib/services/videoViewService";
import { ApiError, handle, ok } from "@/src/lib/api";

const RecordViewSchema = z.object({
  mediaId: z.string(),
  sessionId: z.string().nullish(),
});

export const POST = handle(async (req: Request) => {
  const data = await recordView(RecordViewSchema.parse(await req.json()));

  return ok(data, data.inserted ? 201 : 200);
});

export const GET = handle(async (req: Request) => {
  const mediaId = new URL(req.url).searchParams.get("media_id");

  if (!mediaId) throw new ApiError(400, "media_id is required");

  return ok(await getStatsByMediaId(mediaId));
});
