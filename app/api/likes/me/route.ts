import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  setLikedByUser,
  getLikedStuffByUser,
} from "@/lib/services/pet/likeService";

type Body = {
  targetType: "pet" | "shelter" | "video";
  targetId: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    if (
      !body?.targetId ||
      !body?.targetType ||
      !["pet", "shelter", "video"].includes(body.targetType)
    ) {
      return NextResponse.json(
        { message: "Invalid targetType or targetId" },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json(
        { message: "You must be logged in to like." },
        { status: 401 },
      );
    }

    await setLikedByUser(
      {
        userId: data.user.id,
        targetType: body.targetType,
        targetId: body.targetId,
      },
      true,
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/likes]", error);

    return NextResponse.json(
      { message: "Failed to like item" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json(
        { message: "You must be logged in to view liked items." },
        { status: 401 },
      );
    }

    const items = await getLikedStuffByUser(data.user.id);

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("[GET /api/likes]", error);

    return NextResponse.json(
      { error: "Failed to fetch liked items" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as Body;

    if (
      !body?.targetId ||
      !body?.targetType ||
      !["pet", "shelter", "video"].includes(body.targetType)
    ) {
      return NextResponse.json(
        { message: "Invalid targetType or targetId" },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json(
        { message: "You must be logged in to like." },
        { status: 401 },
      );
    }

    await setLikedByUser(
      {
        userId: data.user.id,
        targetType: body.targetType,
        targetId: body.targetId,
      },
      false,
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/likes]", error);

    return NextResponse.json(
      { message: "Failed to unlike item" },
      { status: 500 },
    );
  }
}
