import { NextResponse } from "next/server";
import { getUserAdoptionNotifications } from "@/src/lib/services/adoptionService";
import { requireAuth } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id: userId } = await params;
    const caller = await requireAuth();

    if (caller.id !== userId) {
      throw new ApiError(403, "You can only view your own adoption requests.");
    }

    const notifications = await getUserAdoptionNotifications(userId);

    return NextResponse.json({ data: notifications }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
