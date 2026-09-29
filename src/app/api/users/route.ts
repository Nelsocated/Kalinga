import { NextResponse } from "next/server";
import { z } from "zod";
import { getMyUser, updateMyUser } from "@/src/lib/services/usersService";
import { getUserId } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

// Only these fields are editable; role and ids are never taken from the body
const UserUpdateSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").optional(),
  username: z.string().trim().min(3, "Username is too short").optional(),
  bio: z.string().optional(),
  contact_email: z.string().optional(),
  contact_phone: z.string().optional(),
  photo_url: z.string().optional(),
});

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

export async function PATCH(req: Request) {
  try {
    const userId = await requireUserId();
    const input = UserUpdateSchema.parse(await req.json());

    const data = await updateMyUser(userId, input);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
