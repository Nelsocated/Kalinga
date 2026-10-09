import "server-only";
import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/src/lib/env/server";
import type { Database } from "./database.types";

/**
 * A signed-out client with no cookies, for reads that are cached and shared by
 * every visitor. It only sees what RLS shows anonymous users.
 */
export function createPublicSupabase() {
  return createClient<Database>(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
