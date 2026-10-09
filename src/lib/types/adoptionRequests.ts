import type { Tables } from "@/src/lib/supabase/database.types";

export type Adoption_Requests = Tables<"adoption_requests">;

export type AdoptionMeta = {
  pet_id: string | null;
  status: string | null;
};

export type PetStatus = "available" | "pending" | "adopted";

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

export type AdoptionRequestRow = Tables<"adoption_requests">;

export type answer = Tables<"adoption_requests">;

