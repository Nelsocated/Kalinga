"use client";

import { createClient } from "@/lib/supabase/client";

export type LikeTargetType = "pet" | "shelter";

type Args = {
  targetType: LikeTargetType;
  targetId: string;
};

function isAuthSessionMissingError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { name?: string; message?: string };
  return (
    maybeError.name === "AuthSessionMissingError"
    || maybeError.message?.includes("Auth session missing")
    || false
  );
}

function tableFor(type: LikeTargetType) {
  return type === "pet" ? "pet_like" : "shelter_like";
}

function idColumnFor(type: LikeTargetType) {
  return type === "pet" ? "pets_id" : "shelter_id";
}

export async function getInitialLiked({ targetType, targetId }: Args) {
  const supabase = createClient();

  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) {
    if (isAuthSessionMissingError(authErr)) {
      return false;
    }

    throw authErr;
  }
  if (!authData.user) return false;

  const table = tableFor(targetType);
  const idCol = idColumnFor(targetType);

  const { data, error } = await supabase
    .from(table)
    .select("user_id")
    .eq("user_id", authData.user.id)
    .eq(idCol, targetId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;

  return !!data;
}

export async function setLiked(
  { targetType, targetId }: Args,
  nextLiked: boolean,
) {
  const supabase = createClient();

  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) {
    if (isAuthSessionMissingError(authErr)) {
      throw new Error("You must be logged in to like.");
    }

    throw authErr;
  }

  const user = authData.user;
  if (!user) throw new Error("You must be logged in to like.");

  const table = tableFor(targetType);
  const idCol = idColumnFor(targetType);

  if (nextLiked) {
    const { error } = await supabase.from(table).insert({
      user_id: user.id,
      [idCol]: targetId,
    });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("user_id", user.id)
      .eq(idCol, targetId);

    if (error) throw error;
  }
}
