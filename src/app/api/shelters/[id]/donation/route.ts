import { NextResponse } from "next/server";
import { getShelterDonations } from "@/src/lib/services/donationService";
import { errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id: shelterId } = await params;

    const data = await getShelterDonations(shelterId);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
