import { NextResponse } from "next/server";
import { authService } from "@/lib/services/authService";

export async function DELETE() {
  try {
    const result = await authService.deleteAccount();

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
      { message: "Account deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE /api/auth/delete-account]", error);

    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
