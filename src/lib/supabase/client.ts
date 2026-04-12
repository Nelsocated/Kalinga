import { createBrowserClient } from "@supabase/ssr";
import { clientEnv } from "@/src/lib/env/client";

export function createClientSupabase() {
  return createBrowserClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
