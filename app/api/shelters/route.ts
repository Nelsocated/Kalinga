import { NextResponse } from "next/server";
import { getSheltersWithStats } from "@/lib/services/shelterService";

export async function GET() {
  try {
    const shelters = await getSheltersWithStats();

    return NextResponse.json(shelters, { status: 200 });
  } catch (error) {
    console.error("[GET /api/shelters]", error);

    return NextResponse.json(
      { message: "Failed to fetch shelters" },
      { status: 500 },
    );
  }
}
