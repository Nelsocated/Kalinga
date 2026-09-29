import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import type { Role, AuthUser } from "./clientAuth";

export async function getUserId(): Promise<string | null> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user.id;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return {
    id: user.id,
    role: data.role as Role,
  };
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

export async function requireUser(): Promise<AuthUser> {
  return requireRole(["user"]);
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
