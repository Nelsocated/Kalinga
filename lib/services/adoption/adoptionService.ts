import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  Adoption_Requests,
  AdoptionRequestRow,
  AdoptionRequestStatus,
  PetRow,
  PetStatus,
  CreateAdoptionRequestInput,
} from "@/lib/types/adoptionRequests";

class AdoptionService {
  private supabase: Awaited<ReturnType<typeof createServerSupabase>> | null =
    null;

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createServerSupabase();
    }
    return this.supabase;
  }

  async getPetAdoptionStatus(
    petId: string,
  ): Promise<{ id: string; status: PetStatus }> {
    const supabase = await this.getSupabase();

    const { data, error } = await supabase
      .from("pets")
      .select("id, status")
      .eq("id", petId)
      .single();

    if (error) throw new Error(error.message);

    return data as { id: string; status: PetStatus };
  }

  async createAdoptionRequest(
    payload: CreateAdoptionRequestInput,
  ): Promise<AdoptionRequestRow> {
    const supabase = await this.getSupabase();

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
      throw new Error(
        "You already submitted an adoption request for this pet.",
      );
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

  async getUserAdoptionNotifications(
    userId: string,
  ): Promise<Adoption_Requests[]> {
    const supabase = await this.getSupabase();

    const { data, error } = await supabase
      .from("adoption_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []) as Adoption_Requests[];
  }

  async getShelterAdoptionNotifications(
    shelterId: string,
  ): Promise<Adoption_Requests[]> {
    const supabase = await this.getSupabase();

    const { data, error } = await supabase
      .from("adoption_requests")
      .select("*")
      .eq("shelter_id", shelterId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []) as Adoption_Requests[];
  }

  async getAdoptedCountByPetIds(petIds: string[]): Promise<number> {
    const supabase = await this.getSupabase();

    if (!petIds.length) return 0;

    const { count, error } = await supabase
      .from("adoption_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "adopted")
      .in("pet_id", petIds);

    if (error) throw new Error(error.message);

    return count ?? 0;
  }
}

export const adoptionService = new AdoptionService();

// Backward-compatible exports
export async function getPetAdoptionStatus(petId: string) {
  return adoptionService.getPetAdoptionStatus(petId);
}

export async function createAdoptionRequest(
  payload: CreateAdoptionRequestInput,
) {
  return adoptionService.createAdoptionRequest(payload);
}

export async function getUserAdoptionNotifications(userId: string) {
  return adoptionService.getUserAdoptionNotifications(userId);
}

export async function getShelterAdoptionNotifications(shelterId: string) {
  return adoptionService.getShelterAdoptionNotifications(shelterId);
}

export async function getAdoptedCountByPetIds(petIds: string[]) {
  return adoptionService.getAdoptedCountByPetIds(petIds);
}
