import { NextRequest, NextResponse } from "next/server";
import { getUserAdoptionNotifications } from "@/lib/services/adoption/adoptionService";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: userId } = await context.params;

    if (!userId) {
      return NextResponse.json(
        { error: "User id is required." },
        { status: 400 },
      );
    }

    const notifications = await getUserAdoptionNotifications(userId);

    return NextResponse.json({ data: notifications }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
