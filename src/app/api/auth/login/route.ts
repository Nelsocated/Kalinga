import { NextResponse } from "next/server";
import { login } from "@/src/lib/services/authService";
import { errorResponse } from "@/src/lib/api";

export async function POST(req: Request) {
  try {
    const { user, session } = await login(await req.json());

    return NextResponse.json({ user, session });
  } catch (error) {
    return errorResponse(error);
  }
}
