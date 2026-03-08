import { supabaseServer } from "@/lib/supabase/server";

export type PetAdoptionStatus = "available" | "pending" | "adopted";

export type AdoptionRequestInsert = {
  pet_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  occupation?: string;
  reason?: string;
  confirm_safe?: boolean;
  confirm_allergies?: boolean;
  confirm_food?: boolean;
  confirm_attention?: boolean;
  confirm_vet?: boolean;
};

export async function getPetAdoptionStatus(petId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("pets")
    .select("id, adoption_status")
    .eq("id", petId)
    .single();

  if (error) throw error;
  return data as { id: string; adoption_status: PetAdoptionStatus };
}

export async function createAdoptionRequest(payload: AdoptionRequestInsert) {
  const supabase = await supabaseServer();

  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select("id, status")
    .eq("id", payload.pet_id)
    .single();

  if (petError) throw petError;

  if (!pet) {
    throw new Error("Pet not found.");
  }

  if (pet.status === "adopted") {
    throw new Error("This pet has already been adopted.");
  }

  // optional: prevent duplicate request by same user
  const { data: existing, error: existingError } = await supabase
    .from("adoption_requests")
    .select("id")
    .eq("pet_id", payload.pet_id)
    .eq("user_id", payload.user_id)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    throw new Error("You already submitted an adoption request for this pet.");
  }

  // 2. insert request
  const { data, error } = await supabase
    .from("adoption_requests")
    .insert({
      pet_id: payload.pet_id,
      user_id: payload.user_id,
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone ?? null,
      address: payload.address ?? null,
      occupation: payload.occupation ?? null,
      reason: payload.reason ?? null,
      confirm_safe: payload.confirm_safe,
      confirm_allergies: payload.confirm_allergies,
      confirm_food: payload.confirm_food,
      confirm_attention: payload.confirm_attention,
      confirm_vet: payload.confirm_vet,
    })
    .select()
    .single();

  if (error) throw error;

  // 3. optionally mark pet as pending once first request exists
  if (pet.status === "available") {
    const { error: updateError } = await supabase
      .from("pets")
      .update({ status: "pending" })
      .eq("id", payload.pet_id);

    if (updateError) throw updateError;
  }

  return data;
}
