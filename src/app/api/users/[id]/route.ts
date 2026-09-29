import { NextResponse } from "next/server";
import { getUserById } from "@/src/lib/services/usersService";
import { ApiError, errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const user = await getUserById(id);

    if (!user) throw new ApiError(404, "User not found");

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
