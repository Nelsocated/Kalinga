import { NextResponse } from "next/server";
import {
  signupShelter,
  submitShelterApplication,
} from "@/src/lib/services/authService";
import { createServerSupabase } from "@/src/lib/supabase/server";

export async function POST(req: Request) {
  const formData = await req.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const applicationPayload = {
    shelter_name: formData.get("shelter_name"),
    complete_address: formData.get("complete_address"),
    registration_certificate: formData.get("registration_certificate"),
    owner_valid_id: formData.get("owner_valid_id"),
    lease_contract: formData.get("lease_contract"),
    shelter_photo: formData.get("shelter_photo"),
  };

  const result = user
    ? await submitShelterApplication(applicationPayload)
    : await signupShelter({
        email: formData.get("email"),
        password: formData.get("password"),
        username: formData.get("username"),
        full_name: formData.get("full_name"),
        ...applicationPayload,
      });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status },
    );
  }

  return NextResponse.json(
    {
      user: result.data.user,
      session: "session" in result.data ? result.data.session : null,
      application_status: result.data.application_status,
    },
    { status: 201 },
  );
}
