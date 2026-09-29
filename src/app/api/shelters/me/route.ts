import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getMyShelterProfile,
  updateMyShelterProfile,
} from "@/src/lib/services/shelterService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

const ShelterUpdateSchema = z.object({
  shelter_name: z.string().optional(),
  logo_url: z.string().optional(),
  about: z.string().optional(),
  location: z.string().optional(),
  contact_email: z.string().optional(),
  contact_phone: z.string().optional(),
});

export async function GET() {
  try {
    const shelterId = await requireOwnedShelterId();
    const data = await getMyShelterProfile(shelterId);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const shelterId = await requireOwnedShelterId();
    const input = ShelterUpdateSchema.parse(await req.json());

    const data = await updateMyShelterProfile(shelterId, input);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
