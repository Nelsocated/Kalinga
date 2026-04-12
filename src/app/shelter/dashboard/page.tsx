import { redirect } from "next/navigation";
import DashboardPage, {
  type DashboardContentItem,
  type DashboardStats,
} from "./DashboardClient";

import {
  fetchShelterById,
  getShelterIdByOwnerId,
} from "@/src/lib/services/shelter/shelterService";
import { getVideosByPetIds } from "@/src/lib/services/petMediaService";
import { getPetLikeCounts } from "@/src/lib/services/likeService";
import { getStatsByMediaIds } from "@/src/lib/services/videoViewService";
import { getAdoptedCountByPetIds } from "@/src/lib/services/adoption/adoptionService";
import { getPetsByShelterDashboard } from "@/src/lib/services/pet/petService";
import type { Dashboard } from "@/src/lib/types/pets";
import { requireShelter } from "@/src/lib/utils/auth";
import type { AuthUser } from "@/src/lib/utils/clientAuth";

export const dynamic = "force-dynamic";

async function getRequiredShelterUser(): Promise<AuthUser> {
  try {
    return await requireShelter();
  } catch {
    redirect("/login");
  }
}

async function getDashboardData(): Promise<{
  stats: DashboardStats;
  items: DashboardContentItem[];
}> {
  const authUser = await getRequiredShelterUser();

  const shelterId = await getShelterIdByOwnerId(authUser.id);

  if (!shelterId) {
    return {
      stats: {
        totalViews: 0,
        totalLikes: 0,
        totalAdoptionsCompleted: 0,
      },
      items: [],
    };
  }

  const shelter = await fetchShelterById(shelterId);

  if (!shelter) {
    return {
      stats: {
        totalViews: 0,
        totalLikes: 0,
        totalAdoptionsCompleted: 0,
      },
      items: [],
    };
  }

  const pets: Dashboard[] = await getPetsByShelterDashboard(shelter.id);

  if (!pets.length) {
    return {
      stats: {
        totalViews: 0,
        totalLikes: 0,
        totalAdoptionsCompleted: 0,
      },
      items: [],
    };
  }

  const petIds = pets.map((pet) => pet.id);

  const petNameMap = new Map<string, string>(
    pets.map((pet) => [pet.id, pet.name ?? "Untitled Pet"]),
  );

  const petPhotoMap = new Map<string, string | null>(
    pets.map((pet) => [pet.id, pet.photo_url]),
  );

  const petSpeciesMap = new Map<string, string | null>(
    pets.map((pet) => [pet.id, pet.species]),
  );

  const media = await getVideosByPetIds(petIds);
  const totalAdoptionsCompleted = await getAdoptedCountByPetIds(petIds);

  if (!media.length) {
    return {
      stats: {
        totalViews: 0,
        totalLikes: 0,
        totalAdoptionsCompleted,
      },
      items: [],
    };
  }

  const mediaIds = media.map((row) => row.id);

  const likeCounts = await getPetLikeCounts(petIds);
  const petLikeCountMap = new Map<string, number>(
    likeCounts.map((row) => [row.petId, row.count]),
  );

  const viewStatsResult = await getStatsByMediaIds(mediaIds);
  const viewCountMap = new Map<string, number>();

  if (viewStatsResult.ok && viewStatsResult.data) {
    for (const row of viewStatsResult.data) {
      viewCountMap.set(row.media_id, row.totalViews);
    }
  }

  const items: DashboardContentItem[] = media.map((row) => {
    const petName = petNameMap.get(row.pet_id) ?? "Untitled Pet";
    const likes = petLikeCountMap.get(row.pet_id) ?? 0;
    const views = viewCountMap.get(row.id) ?? 0;
    const petPhoto = petPhotoMap.get(row.pet_id) ?? null;
    const petSpecies = petSpeciesMap.get(row.pet_id) ?? null;

    return {
      id: row.id,
      title: row.caption?.trim() || "Video Title",
      petName,
      datePosted: row.created_at,
      views,
      likes,
      photo_url: petPhoto,
      species: petSpecies,
    };
  });

  const totalLikes = items.reduce((sum, item) => sum + item.likes, 0);
  const totalViews = items.reduce((sum, item) => sum + item.views, 0);

  return {
    stats: {
      totalViews,
      totalLikes,
      totalAdoptionsCompleted,
    },
    items,
  };
}

export default async function Page() {
  const data = await getDashboardData();

  return <DashboardPage stats={data.stats} items={data.items} />;
}
