import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getStatsByMediaId,
  recordView,
} from "@/src/lib/services/videoViewService";
import { ApiError, errorResponse } from "@/src/lib/api";

const RecordViewSchema = z.object({
  mediaId: z.string(),
  sessionId: z.string().nullish(),
});

export async function POST(req: NextRequest) {
  try {
    const input = RecordViewSchema.parse(await req.json());
    const data = await recordView(input);

    return NextResponse.json(
      {
        message: data.inserted ? "View recorded" : "View already counted recently",
        data,
      },
      { status: data.inserted ? 201 : 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const mediaId = req.nextUrl.searchParams.get("media_id");

    if (!mediaId) throw new ApiError(400, "media_id is required");

    const data = await getStatsByMediaId(mediaId);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
