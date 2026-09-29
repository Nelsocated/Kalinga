import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getShelterApplicationById,
  updateShelterApplicationStatus,
} from "@/src/lib/services/adminService";
import { requireAdmin } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ReviewSchema = z.object({
  status: z.enum(["under_review", "approved", "rejected"], {
    message: "Valid status is required.",
  }),
  reviewNote: z.string().nullish(),
});

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const data = await getShelterApplicationById(id);

    return NextResponse.json({ ok: true, data, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;
    const input = ReviewSchema.parse(await req.json());

    const data = await updateShelterApplicationStatus({
      id,
      status: input.status,
      reviewNote: input.reviewNote ?? null,
      reviewedBy: admin.id,
    });

    return NextResponse.json({ ok: true, data, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
