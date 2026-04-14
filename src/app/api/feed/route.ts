// app/api/feed/route.ts
import { getFeed } from "@/src/lib/services/feedService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit") ?? 10);
  const excludedParam = searchParams.get("excluded") ?? "";
  const excludedIds = excludedParam
    ? excludedParam.split(",").filter(Boolean)
    : [];

  // Only pin the media on the very first load (no excluded IDs yet)
  const mediaId = excludedIds.length === 0 ? searchParams.get("media") : null;

  const items = await getFeed(limit, excludedIds, mediaId);
  return Response.json({ items });
}
