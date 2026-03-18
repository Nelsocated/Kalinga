import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  getInitialLikedByUser,
  setLikedByUser,
} from "@/lib/services/pet/likeService";

type LikeTargetType = "pet" | "shelter" | "video";

type Body = {
  targetType: LikeTargetType;
  targetId: string;
};

function isValidTargetType(value: unknown): value is LikeTargetType {
  return value === "pet" || value === "shelter" || value === "video";
}

async function getUserOrNull() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");

    if (!isValidTargetType(targetType) || !targetId) {
      return NextResponse.json(
        { message: "Invalid targetType or targetId" },
        { status: 400 },
      );
    }

    const user = await getUserOrNull();

    if (!user) {
      return NextResponse.json({ liked: false }, { status: 200 });
    }

    const liked = await getInitialLikedByUser({
      userId: user.id,
      targetType,
      targetId,
    });

    return NextResponse.json({ liked }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/likes]", error);

    return NextResponse.json(
      { message: "Failed to fetch like status" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    if (!isValidTargetType(body?.targetType) || !body?.targetId) {
      return NextResponse.json(
        { message: "Invalid targetType or targetId" },
        { status: 400 },
      );
    }

    const user = await getUserOrNull();

    if (!user) {
      return NextResponse.json(
        { message: "You must be logged in to like." },
        { status: 401 },
      );
    }

    await setLikedByUser(
      {
        userId: user.id,
        targetType: body.targetType,
        targetId: body.targetId,
      },
      true,
    );

    return NextResponse.json({ success: true, liked: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/likes]", error);

    return NextResponse.json(
      { message: "Failed to like item" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as Body;

    if (!isValidTargetType(body?.targetType) || !body?.targetId) {
      return NextResponse.json(
        { message: "Invalid targetType or targetId" },
        { status: 400 },
      );
    }

    const user = await getUserOrNull();

    if (!user) {
      return NextResponse.json(
        { message: "You must be logged in to unlike." },
        { status: 401 },
      );
    }

    await setLikedByUser(
      {
        userId: user.id,
        targetType: body.targetType,
        targetId: body.targetId,
      },
      false,
    );

    return NextResponse.json({ success: true, liked: false }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/likes]", error);

    return NextResponse.json(
      { message: "Failed to unlike item" },
      { status: 500 },
    );
  }
}
