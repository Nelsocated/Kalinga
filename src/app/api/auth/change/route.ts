import { NextResponse } from "next/server";
import {
  changePassword,
  getSessionUser,
} from "@/src/lib/services/authService";
import { ApiError, errorResponse } from "@/src/lib/api";

export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();

    if (!user) throw new ApiError(401, "Unauthorized");

    await changePassword(user, await req.json());

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
