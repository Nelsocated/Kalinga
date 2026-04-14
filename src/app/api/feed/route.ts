import { getFeed } from "@/src/lib/services/feedService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mediaId = searchParams.get("media");

  const items = await getFeed(mediaId);

  return Response.json({ items });
}
