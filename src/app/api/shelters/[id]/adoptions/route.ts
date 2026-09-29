import { NextResponse } from "next/server";
import { getShelterAdoptionNotifications } from "@/src/lib/services/adoptionService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const shelterId = await requireOwnedShelterId();

    if (shelterId !== id) {
      throw new ApiError(
        403,
        "You can only view your own shelter's adoption requests.",
      );
    }

    const notifications = await getShelterAdoptionNotifications(id);

    return NextResponse.json({ data: notifications }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
