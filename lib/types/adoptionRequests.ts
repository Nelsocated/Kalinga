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
