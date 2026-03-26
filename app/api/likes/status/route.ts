import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getInitialLikedByUser } from "@/lib/services/likeService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");

    if (
      !targetType ||
      !targetId ||
      !["pet", "shelter", "video"].includes(targetType)
    ) {
      return NextResponse.json(
        { message: "Invalid targetType or targetId" },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json({ liked: false }, { status: 200 });
    }

    const liked = await getInitialLikedByUser({
      userId: data.user.id,
      targetType: targetType as "pet" | "shelter" | "video",
      targetId,
    });

    return NextResponse.json({ liked }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/likes/status]", error);

    return NextResponse.json(
      { message: "Failed to fetch like status" },
      { status: 500 },
    );
  }
}
