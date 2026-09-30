import { NextResponse } from "next/server";
import { getMyUser } from "@/src/lib/services/usersService";
import { getUserId } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

async function requireUserId() {
  const userId = await getUserId();

  if (!userId) throw new ApiError(401, "Unauthorized");

  return userId;
}

export async function GET() {
  try {
    const data = await getMyUser(await requireUserId());

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

