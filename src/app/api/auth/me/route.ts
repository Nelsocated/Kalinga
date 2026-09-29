import { NextResponse } from "next/server";
import { getSessionUser } from "@/src/lib/services/authService";
import { ApiError, errorResponse } from "@/src/lib/api";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) throw new ApiError(401, "Unauthorized");

    return NextResponse.json({ user });
  } catch (error) {
    return errorResponse(error);
  }
}
