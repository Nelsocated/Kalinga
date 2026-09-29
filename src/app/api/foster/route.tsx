import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createFoster,
  getFosterStories,
} from "@/src/lib/services/fosterService";
import { assertShelterOwnsPet } from "@/src/lib/services/petService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

const CreateFosterSchema = z.object({
  petId: z.string().trim().min(1, "Pet is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Story is required"),
  // The form's "not available" option marks the pet as pending
  adoptionStatus: z
    .enum(["available", "not_available", ""])
    .optional()
    .transform((value) =>
      value === "available"
        ? "available"
        : value === "not_available"
          ? "pending"
          : undefined,
    ),
});

export async function GET() {
  try {
    const data = await getFosterStories();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const shelterId = await requireOwnedShelterId();
    const input = CreateFosterSchema.parse(await req.json());

    await assertShelterOwnsPet(shelterId, input.petId);

    const data = await createFoster(input);

    return NextResponse.json(
      { message: "Foster story created successfully", data },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
