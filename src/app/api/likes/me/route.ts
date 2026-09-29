import { NextResponse } from "next/server";
import { getLikedStuffByUser } from "@/src/lib/services/likeService";
import { getUserId } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      throw new ApiError(401, "You must be logged in to view liked items.");
    }

    const items = await getLikedStuffByUser(userId);

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
