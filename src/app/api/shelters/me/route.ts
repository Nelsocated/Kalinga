import { NextResponse } from "next/server";
import { getMyShelterProfile } from "@/src/lib/services/shelterService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

export async function GET() {
  try {
    const shelterId = await requireOwnedShelterId();
    const data = await getMyShelterProfile(shelterId);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

