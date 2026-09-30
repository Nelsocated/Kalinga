import { redirect } from "next/navigation";
import { getShelterInboxThreads } from "@/src/lib/services/messages/inbox";
import { getMyShelterProfile } from "@/src/lib/services/shelterService";
import { getUsersByIds } from "@/src/lib/services/usersService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import ShelterMessagesClient from "./ShelterMessageClient";
import type { PersonCard, ThreadWithMeta } from "@/src/lib/types/messages";

async function getShelterOrRedirect() {
  try {
    return await getMyShelterProfile(await requireOwnedShelterId());
  } catch {
    redirect("/login");
  }
}

export default async function Page() {
  const shelter = await getShelterOrRedirect();

  const currentShelterCard: PersonCard = {
    id: shelter.id,
    name: shelter.shelter_name ?? "Shelter",
    image: shelter.logo_url ?? null,
    subtitle: shelter.location ?? null,
  };

  const rawThreads = await getShelterInboxThreads(shelter.id);

  const userProfiles = await getUsersByIds(rawThreads.map((t) => t.user_id));

  const profileMap = new Map(userProfiles.map((p) => [p.id, p]));

  const initialThreads: ThreadWithMeta[] = rawThreads.map((thread) => {
    const profile = profileMap.get(thread.user_id);
    return {
      ...thread,
      other_party: {
        id: thread.user_id,
        name: profile?.full_name ?? profile?.username ?? "User",
        image: profile?.photo_url ?? null,
        subtitle: null,
      },
    };
  });

  return (
    <ShelterMessagesClient
      shelterId={shelter.id}
      currentShelterCard={currentShelterCard}
      initialThreads={initialThreads}
    />
  );
}
