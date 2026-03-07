import { NextResponse } from "next/server";
import { getSheltersWithStats } from "@/lib/db/shelter";

export async function GET() {
  try {
    const shelters = await getSheltersWithStats();
    return NextResponse.json(shelters);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch shelters";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
