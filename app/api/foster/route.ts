import { NextRequest, NextResponse } from "next/server";
import { getFosterStories } from "@/lib/services/fosterService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 20;

    const fosters = await getFosterStories(
      Number.isFinite(limit) && limit > 0 ? limit : 20,
    );

    return NextResponse.json(fosters, { status: 200 });
  } catch (error) {
    console.error("GET /api/fosters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch foster stories" },
      { status: 500 },
    );
  }
}
