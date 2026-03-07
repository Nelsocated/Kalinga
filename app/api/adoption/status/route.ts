import { NextRequest, NextResponse } from "next/server";
import { getPetAdoptionStatus } from "@/lib/services/adoption";

export async function GET(req: NextRequest) {
  try {
    const petId = req.nextUrl.searchParams.get("pet_id");

    if (!petId) {
      return NextResponse.json({ error: "Missing pet_id" }, { status: 400 });
    }

    const data = await getPetAdoptionStatus(petId);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch pet adoption status." },
      { status: 500 },
    );
  }
}
