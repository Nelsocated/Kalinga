import "server-only";
import { cache } from "react";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import type { Role, AuthUser } from "./clientAuth";

/**
 * The signed-in account's id. getClaims() verifies the access token against the
 * project's ES256 signing keys locally (the keys are cached), so unlike getUser()
 * this is not a round trip to Supabase Auth. The proxy has already refreshed an
 * expired token. Cached so each request reads it once.
 */
export const getUserId = cache(async (): Promise<string | null> => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) return null;

  return typeof data.claims.sub === "string" ? data.claims.sub : null;
});

/** The account's role, read once per request. Null when the row can't be read. */
const getRole = cache(async (userId: string): Promise<Role | null> => {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return data.role as Role;
});

export async function getAuthUser(): Promise<AuthUser | null> {
  const id = await getUserId();
  if (!id) return null;

  const role = await getRole(id);
  return role ? { id, role } : null;
}

/**
 * The user the nav is built from. Unlike getAuthUser, a signed-in account whose
 * role row can't be read still counts as signed in, so the nav never sends it to login.
 * Not for permission checks: use requireAuth / requireRole for those.
 */
export async function getNavUser(): Promise<AuthUser | null> {
  const id = await getUserId();
  if (!id) return null;

  return { id, role: (await getRole(id)) ?? "user" };
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) throw new ApiError(401, "Unauthorized");

  return user;
}

export async function requireRole(allowed: Role[]): Promise<AuthUser> {
  const user = await requireAuth();

  if (!allowed.includes(user.role)) throw new ApiError(403, "Forbidden");

  return user;
}

export async function requireShelter(): Promise<AuthUser> {
  return requireRole(["shelter"]);
}

export async function requireAdmin(): Promise<AuthUser> {
  return requireRole(["admin"]);
}

/** Returns the id of the shelter owned by the signed-in shelter account. */
export async function requireOwnedShelterId(): Promise<string> {
  const user = await requireShelter();
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new ApiError(404, "Shelter profile not found");

  return data.id as string;
}
