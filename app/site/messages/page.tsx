import { redirect } from "next/navigation";
import UserMessagesClient from "./UserMessagesClient";
import { getUserId } from "@/lib/utils/getUserId";
import { getUserInboxThreads } from "@/lib/services/messageService";
import { getUserById } from "@/lib/services/user/usersService";
import { fetchShelterById } from "@/lib/services/shelter/shelterService";
import { getLikedIdsByUser } from "@/lib/services/likeService";
import type { ThreadWithMeta } from "@/lib/types/messages";

type PersonCard = {
  id: string;
  name: string;
  image: string | null;
  subtitle?: string | null;
};

export type ShelterOption = {
  id: string;
  name: string;
  location: string | null;
  logo_url: string | null;
};

function isShelterOption(
  shelter: ShelterOption | null,
): shelter is ShelterOption {
  return shelter !== null;
}

async function getMessagePageData() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  const [threads, likedIds, currentUser] = await Promise.all([
    getUserInboxThreads(userId),
    getLikedIdsByUser(userId),
    getUserById(userId),
  ]);

  const threadShelterIds = threads
    .map((thread) => thread.shelter_id)
    .filter((id): id is string => Boolean(id));

  const likedShelterIds = likedIds.shelterIds ?? [];

  const uniqueShelterIds = Array.from(
    new Set([...threadShelterIds, ...likedShelterIds]),
  );

  const sheltersData: Array<ShelterOption | null> = await Promise.all(
    uniqueShelterIds.map(async (shelterId) => {
      try {
        const shelter = await fetchShelterById(shelterId);

        return {
          id: shelterId,
          name: shelter?.shelter_name || "Unknown Shelter",
          location: shelter?.location ?? null,
          logo_url: shelter?.logo_url ?? null,
        };
      } catch (error) {
        console.error(
          `[Messages/Page] Failed to fetch shelter ${shelterId}`,
          error,
        );
        return null;
      }
    }),
  );

  const allShelters = sheltersData.filter(isShelterOption);

  const shelterMap = new Map(
    allShelters.map((shelter) => [shelter.id, shelter]),
  );

  const likedShelters = allShelters
    .filter((shelter) => likedShelterIds.includes(shelter.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const threadShelters = allShelters
    .filter((shelter) => threadShelterIds.includes(shelter.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const initialThreads: ThreadWithMeta[] = threads.map((thread) => {
    const shelter = shelterMap.get(thread.shelter_id);

    return {
      ...thread,
      other_party: {
        id: thread.shelter_id,
        name: shelter?.name || "Unknown Shelter",
        image: shelter?.logo_url ?? null,
        subtitle: shelter?.location ?? null,
      },
    };
  });

  const currentUserCard: PersonCard = {
    id: userId,
    name: currentUser?.full_name || "You",
    image: currentUser?.photo_url || null,
  };

  return {
    userId,
    currentUserCard,
    initialThreads,
    likedShelters,
    threadShelters,
  };
}

export default async function Page() {
  const {
    userId,
    currentUserCard,
    initialThreads,
    likedShelters,
    threadShelters,
  } = await getMessagePageData();

  return (
    <UserMessagesClient
      userId={userId}
      currentUserCard={currentUserCard}
      initialThreads={initialThreads.filter((t) => t.other_party != null)}
      likedShelters={likedShelters}
      threadShelters={threadShelters}
    />
  );
}
