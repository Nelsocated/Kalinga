import { NextResponse } from "next/server";
import { getShelterPostedVideos } from "@/lib/services/shelterService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const videos = await getShelterPostedVideos(id);

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error("[GET /api/shelters/[id]/videos]", error);

    return NextResponse.json(
      { message: "Failed to fetch shelter videos" },
      { status: 500 },
    );
  }
}
