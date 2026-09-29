import { NextResponse } from "next/server";
import {
  deleteAccount,
  getSessionUser,
} from "@/src/lib/services/authService";
import { ApiError, errorResponse } from "@/src/lib/api";

export async function DELETE() {
  try {
    const user = await getSessionUser();

    if (!user) throw new ApiError(401, "Unauthorized");

    await deleteAccount(user.id);

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
