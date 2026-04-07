import { NextResponse } from "next/server";
import { createVideo } from "@/lib/services/petMediaService";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const petId = String(formData.get("petId") ?? "");
    const title = String(formData.get("title") ?? "");
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Video file is required" },
        { status: 400 },
      );
    }

    const result = await createVideo({
      petId,
      title,
      file,
    });

    if (!result.ok) {
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
    console.error("[POST /api/videos]", error);

    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 },
    );
  }
}
