import { NextResponse } from "next/server";
<<<<<<< HEAD
import { getFeed } from "@/lib/services/feedService";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Failed to fetch feed";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const limit = Number(limitParam ?? 10);

    const data = await getFeed(
      Number.isFinite(limit) && limit > 0 ? limit : 10,
    );

    return NextResponse.json({ items: data });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
=======
import { getFeed } from "@/lib/services/feed";

export async function GET() {
  try {
    const data = await getFeed();
    return NextResponse.json({ items: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
>>>>>>> 3aeb1e6ef0d28ce5d1ac3179fb69c332e0aaef97
  }
}
