import { NextResponse } from "next/server";
import { uploadMyAvatar } from "@/src/lib/services/usersService";
import { getUserId } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();

    if (!userId) throw new ApiError(401, "Unauthorized");

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) throw new ApiError(400, "Missing image file");

    const photoUrl = await uploadMyAvatar(userId, file);

    return NextResponse.json({ data: { photo_url: photoUrl } }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
