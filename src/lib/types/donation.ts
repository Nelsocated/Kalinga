import type { Tables } from "@/src/lib/supabase/database.types";

export type Donations = Tables<"donation">;

export interface MonetaryMethod {
  id?: string;
  method: string;
  account_name: string;
  account_number: string;
  qr_url: string;
}

/** A shelter's whole donation setup, as the edit form reads and saves it. */
export interface DonationSettings {
  enabled: boolean;
  monetary: MonetaryMethod[];
  goods: { id?: string; items: string[]; note: string };
}
