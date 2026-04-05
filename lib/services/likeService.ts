import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  Likes,
  LikedMiniItem,
  LikeArgs,
  PetLikeCount,
  LikedIdsGrouped,
} from "@/lib/types/likes";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import { getPetsByIds } from "./pet/petService";
import { getSheltersByIds } from "./shelter/shelterService";
import { getVideosByPetIds } from "./petMediaService";

class LikeService {
  private supabase: Awaited<ReturnType<typeof createServerSupabase>> | null =
    null;

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createServerSupabase();
    }
    return this.supabase;
  }

  async getInitialLikedByUser({
    userId,
    targetType,
    targetId,
  }: LikeArgs): Promise<boolean> {
    const supabase = await this.getSupabase();

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

  async setLikedByUser(
    { userId, targetType, targetId }: LikeArgs,
    nextLiked: boolean,
  ) {
    const supabase = await this.getSupabase();

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

  async getLikedIdsByUser(userId: string): Promise<LikedIdsGrouped> {
    const supabase = await this.getSupabase();

    const { data, error } = await supabase
      .from("likes")
      .select("target_type,target_id")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    const rows = (data ?? []) as Array<{
      target_type: "pet" | "shelter" | "video";
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

  async getLikedStuffByUser(userId: string): Promise<LikedMiniItem[]> {
    const { petIds, shelterIds, videoIds } =
      await this.getLikedIdsByUser(userId);

    // Fetch pets/videos first so we can derive shelter IDs from liked pets
    const [pets, videos] = await Promise.all([
      getPetsByIds(petIds),
      getVideosByPetIds(videoIds),
    ]);

    const petShelterIds = pets
      .map((pet) => (pet as { shelter_id?: string | null }).shelter_id ?? "")
      .filter(Boolean);

    const allNeededShelterIds = [...new Set([...shelterIds, ...petShelterIds])];
    const shelters = await getSheltersByIds(allNeededShelterIds);

    const shelterMap = new Map(shelters.map((s) => [s.id, s]));
    const likedShelterSet = new Set(shelterIds);

    const petItems: LikedMiniItem[] = pets.map((pet) => {
      const shelterId =
        (pet as { shelter_id?: string | null }).shelter_id ?? null;
      const shelter = shelterId ? shelterMap.get(shelterId) : undefined;

      return {
        id: pet.id,
        kind: "pet",
        href: `/site/profiles/pet/${pet.id}`,
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

  async getPetLikeCounts(petIds: string[]): Promise<PetLikeCount[]> {
    const supabase = await createServerSupabase();

    if (!petIds.length) return [];

    const { data, error } = await supabase
      .from("likes")
      .select("target_id")
      .eq("target_type", "pet")
      .in("target_id", petIds);

    if (error || !data) {
      return petIds.map((petId) => ({
        petId,
        count: 0,
      }));
    }

    const countMap = new Map<string, number>();

    for (const petId of petIds) {
      countMap.set(petId, 0);
    }

    for (const row of data) {
      countMap.set(row.target_id, (countMap.get(row.target_id) ?? 0) + 1);
    }

    return petIds.map((petId) => ({
      petId,
      count: countMap.get(petId) ?? 0,
    }));
  }
}

export const likeService = new LikeService();

// Backward-compatible exports
export async function getInitialLikedByUser(args: LikeArgs): Promise<boolean> {
  return likeService.getInitialLikedByUser(args);
}

export async function setLikedByUser(args: LikeArgs, nextLiked: boolean) {
  return likeService.setLikedByUser(args, nextLiked);
}

export async function getLikedIdsByUser(
  userId: string,
): Promise<LikedIdsGrouped> {
  return likeService.getLikedIdsByUser(userId);
}

export async function getLikedStuffByUser(
  userId: string,
): Promise<LikedMiniItem[]> {
  return likeService.getLikedStuffByUser(userId);
}

export async function getPetLikeCounts(
  petIds: string[],
): Promise<PetLikeCount[]> {
  return likeService.getPetLikeCounts(petIds);
}
