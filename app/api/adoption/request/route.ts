import { NextRequest, NextResponse } from "next/server";
import { createAdoptionRequest } from "@/lib/services/adoption";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to submit an adoption request." },
        { status: 401 },
      );
    }

    const body = await req.json();

    const pet_id = body.pet_id;
    const full_name = body.full_name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const address = body.address?.trim();
    const occupation = body.occupation?.trim();
    const reason = body.reason?.trim();
    const confirm_safe = body.confirm_safe;
    const confirm_allergies = body.confirm_allergies;
    const confirm_food = body.confirm_food;
    const confirm_attention = body.confirm_attention;
    const confirm_vet = body.confirm_vet;

    if (!pet_id || !full_name || !email) {
      return NextResponse.json(
        { error: "pet_id, full_name, and email are required." },
        { status: 400 },
      );
    }

    const data = await createAdoptionRequest({
      pet_id,
      user_id: user.id,
      full_name,
      email,
      phone,
      address,
      occupation,
      reason,
      confirm_safe,
      confirm_allergies,
      confirm_food,
      confirm_attention,
      confirm_vet,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to create adoption request." },
      { status: 500 },
    );
  }
}
