import { NextResponse } from "next/server";
import { getPetAdoptionStatus } from "@/src/lib/services/adoptionService";
import { errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id: petId } = await params;

    const data = await getPetAdoptionStatus(petId);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
