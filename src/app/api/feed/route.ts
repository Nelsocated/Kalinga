import { getFeed } from "@/src/lib/services/feedService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit") ?? 10);
  const page = Number(searchParams.get("page") ?? 0);
  const mediaId = searchParams.get("media");

  const items = await getFeed(limit, page, mediaId);

  return Response.json({ items });
}
