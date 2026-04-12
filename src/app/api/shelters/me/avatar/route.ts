import { NextRequest, NextResponse } from "next/server";
import { uploadShelterAvatar } from "@/src/lib/services/shelter/shelterService";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await uploadShelterAvatar(file);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ publicUrl: result.data }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/shelters/me/avatar]", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 },
    );
  }
}
