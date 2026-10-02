"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClientSupabase } from "@/src/lib/supabase/client";
import type { AuthUser, Role } from "@/src/lib/utils/clientAuth";

const supabase = createClientSupabase();

async function readSessionUser(): Promise<AuthUser | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  // A signed-in account without a readable role still gets the regular links, not /login
  return { id: session.user.id, role: (data?.role as Role | undefined) ?? "user" };
}

/**
 * The user the nav links are built from. Starts from the layout's server read, but
 * layouts survive client navigation, so a stale "signed out" snapshot is re-checked
 * against the browser session on every route change.
 */
export function useNavUser(serverUser: AuthUser | null) {
  const pathname = usePathname();
  const [user, setUser] = useState(serverUser);

  useEffect(() => setUser(serverUser), [serverUser]);

  useEffect(() => {
    if (serverUser) return;
    let cancelled = false;
    readSessionUser().then((u) => {
      if (!cancelled && u) setUser(u);
    });
    return () => {
      cancelled = true;
    };
  }, [serverUser, pathname]);

  return user;
}
