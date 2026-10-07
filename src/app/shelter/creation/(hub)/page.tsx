import { redirect } from "next/navigation";
import WebTemplate from "@/src/components/template/WebTemplate";
import CreationPageView, { type WaitingPet } from "@/src/components/views/CreationPageView";
import { getUserId } from "@/src/lib/utils/auth";
import { getShelterIdByOwnerId } from "@/src/lib/services/shelterService";
import { getPetsByShelter } from "@/src/lib/services/petService";
import { getPetVideosByShelterId } from "@/src/lib/services/petMediaService";

export const dynamic = "force-dynamic";

export default async function Page() {
  const ownerId = await getUserId();
  if (!ownerId) redirect("/login");

  const shelterId = await getShelterIdByOwnerId(ownerId);
  const [pets, videos] = shelterId
    ? await Promise.all([getPetsByShelter(shelterId), getPetVideosByShelterId(shelterId)])
    : [[], []];

  // Pets still looking for a home that have never been in the feed
  const withVideo = new Set(videos.map((video) => video.pet_id));
  const waiting: WaitingPet[] = pets
    .filter((pet) => pet.status !== "adopted" && !withVideo.has(pet.id))
    .map((pet) => ({ id: pet.id, name: pet.pet_name || "Unnamed pet", photoUrl: pet.photo_url ?? null }));

  return (
    <WebTemplate
      header="Create"
      main={<CreationPageView petCount={pets.length} waiting={waiting} />}
    />
  );
}
