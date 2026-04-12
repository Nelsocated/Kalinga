export interface Adoption_Requests {
  id: string;
  pet_id: string;
  shelter_id: string;
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
  status:
    | "pending"
    | "under_review"
    | "contacting_applicant"
    | "not_approved"
    | "withdrawn"
    | "approved"
    | "adopted";
  updated_at: string;
  created_at: string;
}

export type AdoptionMeta = {
  pet_id: string | null;
  status: string | null;
};

export type PetStatus = "available" | "pending" | "adopted";

export type AdoptionRequestStatus =
  | "pending"
  | "under_review"
  | "contacting_applicant"
  | "not_approved"
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
  updated_at: string;
};

export type PetRow = {
  id: string;
  status: PetStatus;
  shelter_id: string | null;
};

export type answer = {
  id: string;
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
  created_at: string;
};

export type PetStatusFull =
  | "pending"
  | "under_review"
  | "contacting_applicant"
  | "approved"
  | "not_approved"
  | "adopted"
  | "withdrawn"
  | null;
