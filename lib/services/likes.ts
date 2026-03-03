"use client";

import { createClient } from "@/lib/supabase/client";

export type LikeTargetType = "pet" | "shelter" | "video";

type Args = {
  targetType: LikeTargetType;
  targetId: string;
};

export async function getInitialLiked({ targetType, targetId }: Args) {
  const supabase = createClient();

  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) throw authErr;
  if (!authData.user) return false;

  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", authData.user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function setLiked(
  { targetType, targetId }: Args,
  nextLiked: boolean,
) {
  const supabase = createClient();

  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) throw authErr;

  const user = authData.user;
  if (!user) throw new Error("You must be logged in to like.");

  if (nextLiked) {
    const { error } = await supabase.from("likes").insert({
      user_id: user.id,
      target_type: targetType,
      target_id: targetId,
    });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId);

    if (error) throw error;
  }
}
