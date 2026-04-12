import { NextResponse } from "next/server";
import { getFeed } from "@/lib/services/feedService";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Failed to fetch feed";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const mediaId = searchParams.get("media");
    const limit = Number(limitParam ?? 10);

    const data = await getFeed(
      Number.isFinite(limit) && limit > 0 ? limit : 10,
      mediaId,
    );

    return NextResponse.json({ items: data });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
