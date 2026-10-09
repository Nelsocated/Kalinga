import type { Tables } from "@/src/lib/supabase/database.types";

/** A foster story as the UI shows it: missing text becomes "". */
export type Fosters = {
  id: string;
  pet_id: string;
  title: string;
  description: string;
  created_at?: string;
};

export type FosterRow = Tables<"foster">;

export type FosterItem = Tables<"foster">;

export type CreateFosterInput = {
  petId: string;
  title: string;
  description: string;
  adoptionStatus?: "available" | "pending";
};
