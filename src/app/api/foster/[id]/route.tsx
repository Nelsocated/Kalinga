import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteFoster,
  getFosterStoryById,
  updateFoster,
} from "@/src/lib/services/fosterService";
import { assertShelterOwnsPet } from "@/src/lib/services/petService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const UpdateFosterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

/** Throws unless the caller's shelter owns the story's pet. */
async function requireOwnedFoster(id: string) {
  const shelterId = await requireOwnedShelterId();
  const foster = await getFosterStoryById(id);

  await assertShelterOwnsPet(shelterId, foster.pet_id);
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const data = await getFosterStoryById(id);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await requireOwnedFoster(id);

    const input = UpdateFosterSchema.parse(await req.json());
    const data = await updateFoster({ id, ...input });

    return NextResponse.json(
      { message: "Foster story updated successfully", data },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await requireOwnedFoster(id);

    const data = await deleteFoster(id);

    return NextResponse.json(
      { message: "Foster story deleted successfully", data },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
