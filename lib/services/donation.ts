import { supabaseServer } from "@/lib/supabase/server";

export async function getShelterDonations(shelterId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("shelter_donations")
    .select("*")
    .eq("shelter_id", shelterId)
    .eq("is_active", true)
    .order("priority", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

type ShelterDonationInsert = {
  shelter_id: string;
  type: "goods" | "monetary";
  item_name?: string;
  method?: string;
  account_name?: string;
  account_number?: string;
  qr_url?: string;
};

export async function createShelterDonation(payload: ShelterDonationInsert) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("shelter_donations")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}
