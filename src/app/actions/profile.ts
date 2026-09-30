"use server";

import { z } from "zod";
import { runAction } from "@/src/lib/action";
import { ApiError } from "@/src/lib/api";
import { getUserId, requireOwnedShelterId } from "@/src/lib/utils/auth";
import { updateMyUser } from "@/src/lib/services/usersService";
import { updateMyShelterProfile } from "@/src/lib/services/shelterService";

// Only these fields are editable; role and ids are never taken from the input
const UserUpdateSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").optional(),
  username: z.string().trim().min(3, "Username is too short").optional(),
  bio: z.string().optional(),
  contact_email: z.string().optional(),
  contact_phone: z.string().optional(),
  photo_url: z.string().optional(),
});

const ShelterUpdateSchema = z.object({
  shelter_name: z.string().optional(),
  logo_url: z.string().optional(),
  about: z.string().optional(),
  location: z.string().optional(),
  contact_email: z.string().optional(),
  contact_phone: z.string().optional(),
});

export async function updateMyUserAction(input: z.input<typeof UserUpdateSchema>) {
  return runAction(async () => {
    const userId = await getUserId();
    if (!userId) throw new ApiError(401, "Unauthorized");
    return updateMyUser(userId, UserUpdateSchema.parse(input));
  });
}

export async function updateMyShelterAction(input: z.input<typeof ShelterUpdateSchema>) {
  return runAction(async () => {
    const shelterId = await requireOwnedShelterId();
    return updateMyShelterProfile(shelterId, ShelterUpdateSchema.parse(input));
  });
}
