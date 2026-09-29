import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createAdoptionRequest,
  getPetAdoptionStatus,
} from "@/src/lib/services/adoptionService";
import { getUserId } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const AdoptionRequestSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required."),
  email: z.string().trim().email("Valid email is required."),
  phone: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().min(5).optional().or(z.literal("")),
  occupation: z.string().trim().optional().or(z.literal("")),
  reason: z.string().trim().optional().or(z.literal("")),
  confirm_safe: z.boolean().optional().default(false),
  confirm_allergies: z.boolean().optional().default(false),
  confirm_food: z.boolean().optional().default(false),
  confirm_attention: z.boolean().optional().default(false),
  confirm_vet: z.boolean().optional().default(false),
});

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id: petId } = await params;

    const data = await getPetAdoptionStatus(petId);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { id: petId } = await params;
    const userId = await getUserId();

    if (!userId) {
      throw new ApiError(
        401,
        "You must be logged in to submit an adoption request.",
      );
    }

    const input = AdoptionRequestSchema.parse(await req.json());

    const data = await createAdoptionRequest({
      ...input,
      pet_id: petId,
      user_id: userId,
      phone: input.phone || null,
      address: input.address || null,
      occupation: input.occupation || null,
      reason: input.reason || null,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
