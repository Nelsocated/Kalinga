import { getFeed } from "@/src/lib/services/feedService";
import { handle, ok } from "@/src/lib/api";

export const GET = handle(async (req: Request) => {
  const mediaId = new URL(req.url).searchParams.get("media");

  return ok(await getFeed(mediaId));
});
