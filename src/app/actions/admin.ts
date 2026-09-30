"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { runAction } from "@/src/lib/action";
import { requireAdmin } from "@/src/lib/utils/auth";
import { updateShelterApplicationStatus } from "@/src/lib/services/adminService";

const ReviewSchema = z.object({
  status: z.enum(["under_review", "approved", "rejected"], {
    message: "Valid status is required.",
  }),
  reviewNote: z.string().nullish(),
});

export async function reviewApplicationAction(
  id: string,
  status: z.input<typeof ReviewSchema>["status"],
  reviewNote?: string | null,
) {
  return runAction(async () => {
    const admin = await requireAdmin();
    const parsed = ReviewSchema.parse({ status, reviewNote });
    const item = await updateShelterApplicationStatus({
      id,
      status: parsed.status,
      reviewNote: parsed.reviewNote ?? null,
      reviewedBy: admin.id,
    });
    revalidatePath("/admin/dashboard");
    return item;
  });
}
