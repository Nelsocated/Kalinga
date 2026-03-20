import { NextResponse } from "next/server";
import { getUserAdoptionNotifications } from "@/lib/services/adoption/adoptionService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id: userId } = await params;

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
