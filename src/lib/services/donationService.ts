import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import type { CreateDonationInput, Donations } from "../types/donation";

export async function getShelterDonations(
  shelterId: string,
): Promise<Donations[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("donation")
    .select("*")
    .eq("shelter_id", shelterId)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  return (data ?? []) as Donations[];
}

export async function createShelterDonation(
  shelterId: string,
  input: CreateDonationInput,
): Promise<Donations> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("donation")
    .insert({ ...input, shelter_id: shelterId })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data as Donations;
}
