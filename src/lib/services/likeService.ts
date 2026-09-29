import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import type {
  LikedMiniItem,
  LikeArgs,
  PetLikeCount,
  LikedIdsGrouped,
} from "@/src/lib/types/likes";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";
import { getPetsByIds } from "./petService";
import { getSheltersByIds } from "./shelterService";
import { getVideosByIds } from "./petMediaService";

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
): Promise<void> {
  const supabase = await createServerSupabase();

  if (nextLiked) {
    const { error } = await supabase.from("likes").insert({
      user_id: userId,
      target_type: targetType,
      target_id: targetId,
    });

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
    target_type: "pet" | "shelter" | "video";
    target_id: string;
  }>;

  const idsOf = (type: "pet" | "shelter" | "video") =>
    rows.filter((row) => row.target_type === type).map((row) => row.target_id);

  return {
    petIds: idsOf("pet"),
    shelterIds: idsOf("shelter"),
    // Video likes store the pet_media id
    videoIds: idsOf("video"),
  };
}

export async function getLikedStuffByUser(
  userId: string,
): Promise<LikedMiniItem[]> {
  const { petIds, shelterIds, videoIds } = await getLikedIdsByUser(userId);

  // Fetch pets/videos first so we can derive shelter IDs from liked pets
  const [pets, videos] = await Promise.all([
    getPetsByIds(petIds),
    getVideosByIds(videoIds),
  ]);

  const petShelterIds = pets.map((pet) => pet.shelter_id).filter(Boolean);

  const shelters = await getSheltersByIds([...shelterIds, ...petShelterIds]);

  const shelterMap = new Map(shelters.map((s) => [s.id, s]));
  const likedShelterSet = new Set(shelterIds);

  const petItems: LikedMiniItem[] = pets.map((pet) => {
    const shelter = shelterMap.get(pet.shelter_id);

    return {
      id: pet.id,
      kind: "pet",
      href: `/site/profiles/pets/${pet.id}`,
      title: pet.pet_name ?? "Pet",
      petName: pet.pet_name ?? "Pet",
      subtitle: pet.breed ?? null,
      imageUrl: (pet.photo_url ?? "").trim() || DEFAULT_AVATAR_URL,
      gender: pet.sex ?? "unknown",
      shelterName: shelter?.shelter_name ?? null,
      shelterLogo: (shelter?.logo_url ?? "").trim() || DEFAULT_AVATAR_URL,
    };
  });

  const shelterItems: LikedMiniItem[] = shelters
    .filter((shelter) => likedShelterSet.has(shelter.id))
    .map((shelter) => ({
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

export async function getPetLikeCounts(
  petIds: string[],
): Promise<PetLikeCount[]> {
  if (!petIds.length) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("likes")
    .select("target_id")
    .eq("target_type", "pet")
    .in("target_id", petIds);

  const countMap = new Map<string, number>(petIds.map((id) => [id, 0]));

  // Like counts are decorative on the dashboard, so fall back to zeros
  if (error) {
    console.error("[getPetLikeCounts]", error);
    return petIds.map((petId) => ({ petId, count: 0 }));
  }

  for (const row of data) {
    countMap.set(row.target_id, (countMap.get(row.target_id) ?? 0) + 1);
  }

  return petIds.map((petId) => ({
    petId,
    count: countMap.get(petId) ?? 0,
  }));
}
