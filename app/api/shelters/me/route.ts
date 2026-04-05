import { NextRequest, NextResponse } from "next/server";
import {
  getMyShelterProfile,
  updateMyShelterProfile,
} from "@/lib/services/shelter/shelterService";

export async function GET() {
  try {
    const result = await getMyShelterProfile();

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          details: result.details ?? null,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/shelters/me]", error);
    return NextResponse.json(
      { error: "Failed to fetch shelter profile" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[PATCH /api/shelters/me] Received body:", body);

    const result = await updateMyShelterProfile(body);

    console.log("[PATCH /api/shelters/me] Service result:", result);

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          details: result.details ?? null,
        },
        { status: result.status },
      );
    }

    console.log("[PATCH /api/shelters/me] Saved data:", result.data);
    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/shelters/me] Error:", error);
    return NextResponse.json(
      { error: "Failed to update shelter profile" },
      { status: 500 },
    );
  }
}
