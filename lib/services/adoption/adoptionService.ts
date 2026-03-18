import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";

export type PetStatus = "available" | "pending" | "adopted";

export type AdoptionRequestStatus =
  | "pending"
  | "contacting applicant"
  | "not approved"
  | "withdrawn"
  | "approved"
  | "adopted";

export type CreateAdoptionRequestInput = {
  pet_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  occupation?: string | null;
  reason?: string | null;
  confirm_safe?: boolean;
  confirm_allergies?: boolean;
  confirm_food?: boolean;
  confirm_attention?: boolean;
  confirm_vet?: boolean;
};

export type AdoptionRequestRow = {
  id: string;
  pet_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  occupation: string | null;
  reason: string | null;
  confirm_safe: boolean;
  confirm_allergies: boolean;
  confirm_food: boolean;
  confirm_attention: boolean;
  confirm_vet: boolean;
  status: AdoptionRequestStatus;
  created_at: string;
};

type PetRow = {
  id: string;
  status: PetStatus;
  shelter_id: string | null;
};

export async function getPetAdoptionStatus(
  petId: string,
): Promise<{ id: string; status: PetStatus }> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pets")
    .select("id, status")
    .eq("id", petId)
    .single();

  if (error) throw new Error(error.message);

  return data as { id: string; status: PetStatus };
}

export async function createAdoptionRequest(
  payload: CreateAdoptionRequestInput,
): Promise<AdoptionRequestRow> {
  const supabase = await createServerSupabase();

  const { data: petData, error: petError } = await supabase
    .from("pets")
    .select("id, status, shelter_id")
    .eq("id", payload.pet_id)
    .single();

  if (petError) throw new Error(petError.message);

  if (!petData) {
    throw new Error("Pet not found.");
  }

  const pet = petData as PetRow;

  if (pet.status === "adopted") {
    throw new Error("This pet has already been adopted.");
  }

  if (!pet.shelter_id) {
    throw new Error("This pet is not linked to a shelter.");
  }

  const { data: existing, error: existingError } = await supabase
    .from("adoption_requests")
    .select("id")
    .eq("pet_id", payload.pet_id)
    .eq("user_id", payload.user_id)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);

  if (existing) {
    throw new Error("You already submitted an adoption request for this pet.");
  }

  const insertPayload = {
    pet_id: payload.pet_id,
    shelter_id: pet.shelter_id,
    user_id: payload.user_id,
    full_name: payload.full_name,
    email: payload.email,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
    occupation: payload.occupation ?? null,
    reason: payload.reason ?? null,
    confirm_safe: payload.confirm_safe ?? false,
    confirm_allergies: payload.confirm_allergies ?? false,
    confirm_food: payload.confirm_food ?? false,
    confirm_attention: payload.confirm_attention ?? false,
    confirm_vet: payload.confirm_vet ?? false,
    status: "pending" as AdoptionRequestStatus,
  };

  const { data, error } = await supabase
    .from("adoption_requests")
    .insert(insertPayload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data as AdoptionRequestRow;
}
