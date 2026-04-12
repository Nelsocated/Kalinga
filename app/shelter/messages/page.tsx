import { redirect } from "next/navigation";
import { getShelterInboxThreads } from "@/lib/services/messageService";
import { getMyShelterProfile } from "@/lib/services/shelter/shelterService";
import { getUserById } from "@/lib/services/user/usersService";
import ShelterMessagesClient from "./ShelterMessageClient";
import type { PersonCard, ThreadWithMeta } from "@/lib/types/messages";

export default async function Page() {
  const shelterResult = await getMyShelterProfile();

  if (!shelterResult.ok || !shelterResult.data) redirect("/login");

  const shelter = shelterResult.data;

  const currentShelterCard: PersonCard = {
    id: shelter.id,
    name: shelter.shelter_name ?? "Shelter",
    image: shelter.logo_url ?? null,
    subtitle: shelter.location ?? null,
  };

  const rawThreads = await getShelterInboxThreads(shelter.id);

  const userIds = [...new Set(rawThreads.map((t) => t.user_id))];

  const userProfiles = await Promise.all(userIds.map((id) => getUserById(id)));

  const profileMap = new Map(
    userProfiles.filter(Boolean).map((p) => [p!.id, p!]),
  );

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
