import { NextResponse } from "next/server";
import { me } from "@/lib/services/authService";

export async function GET() {
  const result = await me();

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status },
    );
  }

  return NextResponse.json({
    user: result.data.user,
  });
}
