import { NextResponse } from "next/server";
import { authService } from "@/src/lib/services/authService";

export async function POST() {
  try {
    const result = await authService.logout();

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, details: result.details ?? null },
        { status: result.status },
      );
    }

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST /api/auth/logout]", error);

    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
