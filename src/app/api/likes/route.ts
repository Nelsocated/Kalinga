import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getInitialLikedByUser,
  setLikedByUser,
} from "@/src/lib/services/likeService";
import { getUserId } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

const LikeTargetSchema = z.object({
  targetType: z.enum(["pet", "shelter", "video"], {
    message: "Invalid targetType or targetId",
  }),
  targetId: z.string().min(1, "Invalid targetType or targetId"),
});

async function requireUserId(action: "like" | "unlike") {
  const userId = await getUserId();

  if (!userId) throw new ApiError(401, `You must be logged in to ${action}.`);

  return userId;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const target = LikeTargetSchema.parse({
      targetType: searchParams.get("targetType"),
      targetId: searchParams.get("targetId"),
    });

    const userId = await getUserId();

    if (!userId) return NextResponse.json({ liked: false }, { status: 200 });

    const liked = await getInitialLikedByUser({ userId, ...target });

    return NextResponse.json({ liked }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const target = LikeTargetSchema.parse(await request.json());
    const userId = await requireUserId("like");

    await setLikedByUser({ userId, ...target }, true);

    return NextResponse.json({ success: true, liked: true }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const target = LikeTargetSchema.parse(await request.json());
    const userId = await requireUserId("unlike");

    await setLikedByUser({ userId, ...target }, false);

    return NextResponse.json({ success: true, liked: false }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
