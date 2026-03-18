export interface Adoption_Requests {
  id: string;
  pet_id: string;
  shelter_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  reason: string;
  confirm_safe: boolean;
  confirm_allergies: boolean;
  confirm_food: boolean;
  confirm_attention: boolean;
  confirm_vet: boolean;
  status:
    | "pending"
    | "contacting applicant"
    | "not approved"
    | "withdrawn"
    | "approved"
    | "adopted";
  created_at: string;
}
