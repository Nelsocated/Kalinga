import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import type { Donations } from "../types/donation";

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
