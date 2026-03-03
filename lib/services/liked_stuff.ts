// lib/services/liked_stuff.ts
"use client";

import { createClient } from "@/lib/supabase/client";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

export type LikedKind = "pet" | "shelter" | "video";

export type LikedMiniItem = {
  id: string;
  kind: LikedKind;

  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;

  rating?: number | null;
  distanceKm?: number | null;
  likedCount?: number | null;
};

export async function fetchLikedStuff(): Promise<LikedMiniItem[]> {
  const supabase = createClient();

  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) throw authErr;
  if (!authData.user) return [];

  const { data: likeRows, error: likeErr } = await supabase
    .from("likes")
    .select("target_type,target_id")
    .eq("user_id", authData.user.id);

  if (likeErr) throw likeErr;

  const petIds =
    likeRows?.filter((r) => r.target_type === "pet").map((r) => r.target_id) ??
    [];
  const shelterIds =
    likeRows
      ?.filter((r) => r.target_type === "shelter")
      .map((r) => r.target_id) ?? [];
  const videoIds =
    likeRows
      ?.filter((r) => r.target_type === "video")
      .map((r) => r.target_id) ?? [];

  const petsRes = petIds.length
    ? await supabase
        .from("pets")
        .select(
          `
            id,
            name,
            breed,
            sex,
            photo_url,
            shelter:shelter_id (
              id,
              logo_url,
              shelter_name
            )
          `,
        )
        .in("id", petIds)
    : { data: [], error: null };

  if (petsRes.error) throw petsRes.error;

  const sheltersRes = shelterIds.length
    ? await supabase
        .from("shelter")
        .select("id,shelter_name,location,logo_url")
        .in("id", shelterIds)
    : { data: [], error: null };

  if (sheltersRes.error) throw sheltersRes.error;

  const videosRes = videoIds.length
    ? await supabase
        .from("pet_media")
        .select("id,type,url,caption,pet_id")
        .eq("type", "video")
        .in("id", videoIds)
    : { data: [], error: null };

  if (videosRes.error) throw videosRes.error;

  const videoPetIds = (videosRes.data ?? [])
    .map((v: any) => v.pet_id)
    .filter(Boolean) as string[];

  const videoPetsRes = videoPetIds.length
    ? await supabase
        .from("pets")
        .select("id,name,photo_url")
        .in("id", videoPetIds)
    : { data: [], error: null };

  if (videoPetsRes.error) throw videoPetsRes.error;

  const petById = new Map<string, any>();
  for (const p of videoPetsRes.data ?? []) petById.set(p.id, p);

  const petItems: LikedMiniItem[] = (petsRes.data ?? []).map((p: any) => ({
    id: p.id,
    kind: "pet",
    title: p.name ?? "Pet",
    subtitle: p.breed ?? null,
    gender: p.sex,
    imageUrl: (p.photo_url ?? "").trim() || DEFAULT_AVATAR_URL,
    shelterName: p.shelter.shelter_name,
    shelterLogo: p.shelter.logo_url,
  }));

  const shelterItems: LikedMiniItem[] = (sheltersRes.data ?? []).map(
    (s: any) => ({
      id: s.id,
      kind: "shelter",
      title: s.shelter_name ?? "Shelter",
      subtitle: s.location ?? null,
      imageUrl: (s.logo_url ?? "").trim() || DEFAULT_AVATAR_URL,
    }),
  );

  const videoItems: LikedMiniItem[] = (videosRes.data ?? []).map((v: any) => {
    const p = v.pet_id ? petById.get(v.pet_id) : null;
    return {
      id: v.id,
      kind: "video",
      title: p?.name ? `${p.name}` : "Video",
      subtitle: v.caption ?? "Pet video",
      imageUrl: (p?.photo_url ?? "").trim() || DEFAULT_AVATAR_URL,
    };
  });

  return [...videoItems, ...petItems, ...shelterItems];
}
