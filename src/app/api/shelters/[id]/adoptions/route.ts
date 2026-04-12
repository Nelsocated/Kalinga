import { NextResponse } from "next/server";
import { getShelterAdoptionNotifications } from "@/src/lib/services/adoption/adoptionService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Shelter id is required." },
        { status: 400 },
      );
    }

    const notifications = await getShelterAdoptionNotifications(id);

    return NextResponse.json({ data: notifications }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
