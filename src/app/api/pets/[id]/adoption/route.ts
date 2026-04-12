import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createAdoptionRequest,
  getPetAdoptionStatus,
} from "@/src/lib/services/adoption/adoptionService";
import { createServerSupabase } from "@/src/lib/supabase/server";

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

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id: petId } = await params;

    if (!petId) {
      return NextResponse.json({ error: "Missing pet id." }, { status: 400 });
    }

    const data = await getPetAdoptionStatus(petId);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { id: petId } = await params;

    if (!petId) {
      return NextResponse.json({ error: "Missing pet id." }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to submit an adoption request." },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = AdoptionRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid adoption request data.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = await createAdoptionRequest({
      pet_id: petId,
      user_id: user.id,
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      address: parsed.data.address || null,
      occupation: parsed.data.occupation || null,
      reason: parsed.data.reason || null,
      confirm_safe: parsed.data.confirm_safe,
      confirm_allergies: parsed.data.confirm_allergies,
      confirm_food: parsed.data.confirm_food,
      confirm_attention: parsed.data.confirm_attention,
      confirm_vet: parsed.data.confirm_vet,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
