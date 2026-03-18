import { NextResponse } from "next/server";
import { login } from "@/lib/services/authService";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const result = await login(body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status },
    );
  }

  return NextResponse.json({
    user: result.data.user,
    session: result.data.session,
  });
}
