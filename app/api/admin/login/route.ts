import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { login } from "@/lib/services/authService";
import type { ServiceResult } from "@/lib/services/authService";

type UserWithSession = {
  user: {
    user_metadata: {
      role: string;
    } & Record<string, unknown>;
  } | null;
  session: unknown;
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const result = await login(body) as ServiceResult<UserWithSession>;

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status || 400 }
    );
  }

  // Check if admin (assume role in user_metadata)
  if (result.data.user?.user_metadata?.role !== 'admin') {
    return NextResponse.json(
      { error: "Access denied. Admin only." },
      { status: 403 }
    );
  }

  // Set session cookie if using SSR auth
  const supabase = await createServerSupabase();
  if (result.data.session) {
    // Supabase handles session via cookies in createServerClient
  }

  return NextResponse.json({
    user: result.data.user,
    session: result.data.session,
  });
}
