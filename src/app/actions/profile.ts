"use server";

import { z } from "zod";
import { runAction } from "@/src/lib/action";
import { ApiError } from "@/src/lib/api";
import { getUserId, requireOwnedShelterId } from "@/src/lib/utils/auth";
import { updateMyUser } from "@/src/lib/services/usersService";
import { updateMyShelterProfile } from "@/src/lib/services/shelterService";
import { getMyDonationSettings, saveMyDonationSettings } from "@/src/lib/services/donationService";
import { revalidatePath } from "next/cache";

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

// QR codes must be files this app uploaded to Supabase storage
const storageUrl = z
  .string()
  .trim()
  .refine(
    (url) => url === "" || url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/`),
    "Upload the QR code again.",
  );

const DonationSettingsSchema = z.object({
  enabled: z.boolean(),
  monetary: z
    .array(
      z.object({
        id: z.string().optional(),
        method: z.string().trim().min(1, "Give each payment method a name, e.g. GCash.").max(60),
        account_name: z.string().trim().max(120),
        account_number: z.string().trim().max(120),
        qr_url: storageUrl,
      }),
    )
    .max(10, "You can list up to 10 payment methods."),
  goods: z.object({
    id: z.string().optional(),
    items: z.array(z.string().trim().min(1).max(60)).max(40, "You can list up to 40 items."),
    note: z.string().trim().max(1000, "Keep drop-off instructions under 1000 characters."),
  }),
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

export async function getMyDonationSettingsAction() {
  return runAction(async () => getMyDonationSettings(await requireOwnedShelterId()));
}

export async function saveMyDonationSettingsAction(input: z.input<typeof DonationSettingsSchema>) {
  return runAction(async () => {
    const shelterId = await requireOwnedShelterId();
    const parsed = DonationSettingsSchema.safeParse(input);
    if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message ?? "Check the donation details.");
    const saved = await saveMyDonationSettings(shelterId, parsed.data);
    revalidatePath(`/site/profiles/shelter/${shelterId}`);
    return saved;
  });
}
