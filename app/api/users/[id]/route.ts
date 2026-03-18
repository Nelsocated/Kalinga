import { NextResponse } from "next/server";
import { getUserById } from "@/lib/services/user/usersService";

type RouteContext = {
  params: {
    id: string;
  };
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const user = await getUserById(params.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
