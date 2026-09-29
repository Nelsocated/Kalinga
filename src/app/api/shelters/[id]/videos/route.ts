import { NextResponse } from "next/server";
import { errorResponse } from "@/src/lib/api";
import { getShelterPostedVideos } from "@/src/lib/services/shelterService";

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
    return errorResponse(error);
  }
}
