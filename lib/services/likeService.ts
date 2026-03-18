import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Likes } from "@/lib/types/likes";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import { getPetsByIds } from "./pet/petService";
import { getSheltersByIds } from "./shelterService";
import { getVideosByIds } from "./petMediaService";

export type LikeTargetType = "pet" | "shelter" | "video";
export type LikedKind = LikeTargetType;

export type LikedMiniItem = {
  id: string;
  kind: LikedKind;
  href?: string;

  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;

  gender?: string | null;
  petName?: string | null;
  shelterName?: string | null;
  shelterLogo?: string | null;

  petsAvailable?: number;
  petsAdopted?: number;

  petId?: string | null;
  thumbnailUrl?: string | null;
  caption?: string | null;
};

type LikeArgs = {
  userId: string;
  targetType: LikeTargetType;
  targetId: string;
};

export type LikedIdsGrouped = {
  petIds: string[];
  shelterIds: string[];
  videoIds: string[];
};

export async function getInitialLikedByUser({
  userId,
  targetType,
  targetId,
}: LikeArgs): Promise<boolean> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return !!data;
}

export async function setLikedByUser(
  { userId, targetType, targetId }: LikeArgs,
  nextLiked: boolean,
) {
  const supabase = await createServerSupabase();

  if (nextLiked) {
    const payload: Omit<Likes, "id" | "created_at"> = {
      user_id: userId,
      target_type: targetType,
      target_id: targetId,
    };

    const { error } = await supabase.from("likes").insert(payload);

    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  if (error) throw new Error(error.message);
}

export async function getLikedIdsByUser(
  userId: string,
): Promise<LikedIdsGrouped> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("likes")
    .select("target_type,target_id")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Array<{
    target_type: LikeTargetType;
    target_id: string;
  }>;

  return {
    petIds: rows
      .filter((row) => row.target_type === "pet")
      .map((row) => row.target_id),
    shelterIds: rows
      .filter((row) => row.target_type === "shelter")
      .map((row) => row.target_id),
    videoIds: rows
      .filter((row) => row.target_type === "video")
      .map((row) => row.target_id),
  };
}

export async function getLikedStuffByUser(
  userId: string,
): Promise<LikedMiniItem[]> {
  const { petIds, shelterIds, videoIds } = await getLikedIdsByUser(userId);

  const [pets, shelters, videos] = await Promise.all([
    getPetsByIds(petIds),
    getSheltersByIds(shelterIds),
    getVideosByIds(videoIds),
  ]);

  const petItems: LikedMiniItem[] = pets.map((pet) => ({
    id: pet.id,
    kind: "pet",
    href: `/site/profiles/pet/${pet.id}`,
    title: pet.pet_name ?? "Pet",
    petName: pet.pet_name ?? "Pet",
    subtitle: pet.breed ?? null,
    imageUrl: (pet.photo_url ?? "").trim() || DEFAULT_AVATAR_URL,
    gender: pet.sex ?? "unknown",
    shelterName: null,
    shelterLogo: DEFAULT_AVATAR_URL,
  }));

  const shelterItems: LikedMiniItem[] = shelters.map((shelter) => ({
    id: shelter.id,
    kind: "shelter",
    href: `/site/profiles/shelter/${shelter.id}`,
    title: shelter.shelter_name ?? "Shelter",
    subtitle: shelter.location ?? null,
    imageUrl: (shelter.logo_url ?? "").trim() || DEFAULT_AVATAR_URL,
    petsAvailable: shelter.total_available_pets ?? 0,
    petsAdopted: shelter.total_adopted_pets ?? 0,
  }));

  const videoItems: LikedMiniItem[] = videos.map((video) => ({
    id: video.id,
    kind: "video",
    title: video.pet?.name ?? "Video",
    petName: video.pet?.name ?? "Unknown Pet",
    subtitle: video.caption ?? "Pet video",
    caption: video.caption ?? null,
    imageUrl: (video.pet?.photo_url ?? "").trim() || DEFAULT_AVATAR_URL,
    thumbnailUrl: (video.pet?.photo_url ?? "").trim() || DEFAULT_AVATAR_URL,
    petId: video.pet?.id ?? null,
  }));

  return [...videoItems, ...petItems, ...shelterItems];
}
