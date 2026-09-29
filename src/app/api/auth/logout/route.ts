import { NextResponse } from "next/server";
import { logout } from "@/src/lib/services/authService";
import { errorResponse } from "@/src/lib/api";

export async function POST() {
  try {
    await logout();

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
