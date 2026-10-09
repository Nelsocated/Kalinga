import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import type {
  Adoption_Requests,
  AdoptionRequestRow,
  PetStatus,
  CreateAdoptionRequestInput,
  answer,
  AdoptionMeta,
} from "@/src/lib/types/adoptionRequests";

export async function getPetAdoptionStatus(
  petId: string,
): Promise<{ id: string; status: PetStatus }> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pets")
    .select("id, status")
    .eq("id", petId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new ApiError(404, "Pet not found.");

  return data as { id: string; status: PetStatus };
}

export async function createAdoptionRequest(
  payload: CreateAdoptionRequestInput,
): Promise<AdoptionRequestRow> {
  const supabase = await createServerSupabase();

  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select("id, status, shelter_id")
    .eq("id", payload.pet_id)
    .maybeSingle();

  if (petError) throw new Error(petError.message);
  if (!pet) throw new ApiError(404, "Pet not found.");

  if (pet.status === "adopted") {
    throw new ApiError(409, "This pet has already been adopted.");
  }

  if (!pet.shelter_id) {
    throw new ApiError(409, "This pet is not linked to a shelter.");
  }

  const { data: existing, error: existingError } = await supabase
    .from("adoption_requests")
    .select("id")
    .eq("pet_id", payload.pet_id)
    .eq("user_id", payload.user_id)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);

  if (existing) {
    throw new ApiError(
      409,
      "You already submitted an adoption request for this pet.",
    );
  }

  const { data, error } = await supabase
    .from("adoption_requests")
    .insert({
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
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data as AdoptionRequestRow;
}

export type UserAdoptionFeedItem = Adoption_Requests & {
  pet: { name: string | null; photo_url: string | null } | null;
  shelter: { shelter_name: string | null } | null;
};

export type ShelterAdoptionFeedItem = Adoption_Requests & {
  pet: {
    name: string | null;
    photo_url: string | null;
    species: string | null;
    sex: string;
  } | null;
  applicant: {
    full_name: string;
    username: string;
    photo_url: string | null;
  } | null;
};

/** A user's adoption requests with the pet and shelter names joined in. */
export async function getUserAdoptionFeed(
  userId: string,
): Promise<UserAdoptionFeedItem[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("adoption_requests")
    .select("*, pet:pets(name, photo_url), shelter:shelter(shelter_name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Embedded to-one joins; the untyped client can't infer their shape
  return (data ?? []) as UserAdoptionFeedItem[];
}

/** A shelter's incoming requests with the pet and applicant joined in. */
export async function getShelterAdoptionFeed(
  shelterId: string,
): Promise<ShelterAdoptionFeedItem[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("adoption_requests")
    .select(
      "*, pet:pets(name, photo_url, species, sex), applicant:users(full_name, username, photo_url)",
    )
    .eq("shelter_id", shelterId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Embedded to-one joins; the untyped client can't infer their shape
  return (data ?? []) as ShelterAdoptionFeedItem[];
}

export async function getAdoptedCountByPetIds(
  petIds: string[],
): Promise<number> {
  if (!petIds.length) return 0;

  const supabase = await createServerSupabase();

  const { count, error } = await supabase
    .from("adoption_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "adopted")
    .in("pet_id", petIds);

  if (error) throw new Error(error.message);

  return count ?? 0;
}

/**
 * Returns an adoption request's answers to its applicant or to the shelter
 * it was sent to. Anyone else gets a 404, so ids can't be probed.
 */
export async function getAdoptionAnswerForViewer(
  id: string,
  viewerId: string,
): Promise<answer> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("adoption_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new ApiError(404, "Answer not found.");

  if (data.user_id !== viewerId) {
    if (!data.shelter_id) throw new ApiError(404, "Answer not found.");

    const { data: shelter, error: shelterError } = await supabase
      .from("shelter")
      .select("id")
      .eq("id", data.shelter_id)
      .eq("owner_id", viewerId)
      .maybeSingle();

    if (shelterError) throw new Error(shelterError.message);
    if (!shelter) throw new ApiError(404, "Answer not found.");
  }

  return data as answer;
}

export async function getAdoptionMetaMap(
  adoptionRequestIds: string[],
): Promise<Map<string, AdoptionMeta>> {
  if (adoptionRequestIds.length === 0) return new Map();

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("adoption_requests")
    .select("id, pet_id, status")
    .in("id", adoptionRequestIds);

  if (error) throw new Error(error.message);

  return new Map(
    (data ?? []).map((row) => [
      row.id,
      {
        pet_id: row.pet_id ?? null,
        status: row.status ?? null,
      },
    ]),
  );
}

/** True when this user has sent at least one adoption request to this shelter. */
export async function hasAppliedToShelter(
  userId: string,
  shelterId: string,
): Promise<boolean> {
  const supabase = await createServerSupabase();

  const { count, error } = await supabase
    .from("adoption_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("shelter_id", shelterId);

  if (error) throw new Error(error.message);

  return (count ?? 0) > 0;
}
