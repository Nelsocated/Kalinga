import { NextResponse } from "next/server";
import { authService } from "@/src/lib/services/authService";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const result = await authService.changePassword(body);

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          details: result.details ?? null,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PATCH /api/auth/change-password]", error);

    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 },
    );
  }
}
