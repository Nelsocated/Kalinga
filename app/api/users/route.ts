import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getMyUser, updateMyUser } from "@/lib/services/user/usersService";
import type { UserUpdatePayload } from "@/lib/services/user/usersService";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

async function getUserOrThrow() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Unauthorized");
  }

  return data.user;
}

export async function GET() {
  try {
    const user = await getUserOrThrow();
    const data = await getMyUser(user.id);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: unknown) {
    const message = getErrorMessage(error);

    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getUserOrThrow();
    const body = (await req.json()) as UserUpdatePayload;

    const data = await updateMyUser(user.id, body);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: unknown) {
    const message = getErrorMessage(error);

    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 },
    );
  }
}
