import { NextRequest, NextResponse } from "next/server";
import { uploadShelterAvatar } from "@/src/lib/services/shelterService";
import { requireShelter } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

export async function POST(req: NextRequest) {
  try {
    const user = await requireShelter();
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) throw new ApiError(400, "No file provided");

    const publicUrl = await uploadShelterAvatar(user.id, file);

    return NextResponse.json({ publicUrl }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
