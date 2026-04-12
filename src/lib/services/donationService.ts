import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import type { Donations } from "../types/donation";

export async function getShelterDonations(shelterId: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("donation")
    .select("*")
    .eq("shelter_id", shelterId)
    .eq("is_active", true);

  if (error) throw error;

  return data ?? [];
}

export async function createShelterDonation(payload: Donations) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("donation")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}
