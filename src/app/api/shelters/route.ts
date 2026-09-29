import { NextResponse } from "next/server";
import { errorResponse } from "@/src/lib/api";
import { getSheltersWithStats } from "@/src/lib/services/shelterService";

export async function GET() {
  try {
    const shelters = await getSheltersWithStats();

    return NextResponse.json(shelters, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
