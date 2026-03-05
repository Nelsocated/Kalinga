import { NextResponse } from "next/server";
import { getShelterPostedVideos } from "@/lib/db/shelter_posts";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await getShelterPostedVideos(id);
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch shelter videos" },
      { status: 500 },
    );
  }
}
