import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";

export async function getUserId(): Promise<string | null> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}
