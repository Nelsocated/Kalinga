import { NextRequest, NextResponse } from "next/server";
import { getStatsByMediaId, recordView } from "@/lib/services/videoViewService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await recordView({
      mediaId: body.mediaId,
      sessionId: body.sessionId,
    });

    if (!result.ok) {
      console.error("[POST /api/views] recordView failed:", result);

      return NextResponse.json(
        {
          error: result.error,
          details: result.details ?? null,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        data: result.data,
      },
      { status: result.status },
    );
  } catch (error) {
    console.error("[POST /api/views] unexpected error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const mediaId = req.nextUrl.searchParams.get("media_id");

    if (!mediaId) {
      return NextResponse.json(
        { error: "media_id is required" },
        { status: 400 },
      );
    }

    const result = await getStatsByMediaId(mediaId);

    if (!result.ok) {
      console.error("[GET /api/views] getStatsByMediaId failed:", result);

      return NextResponse.json(
        {
          error: result.error,
          details: result.details ?? null,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        data: result.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/views] unexpected error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
